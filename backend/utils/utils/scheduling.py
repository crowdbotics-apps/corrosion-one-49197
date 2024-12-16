import calendar
from datetime import timedelta, datetime, date
from itertools import islice, takewhile

from django.db import models, transaction
from model_utils.models import TimeStampedModel
from munch import munchify
from rest_framework import serializers
from timezone_field import TimeZoneField


def get_attr_or_item(obj, attr, default=None):
    if hasattr(obj, attr):
        return getattr(obj, attr)
    else:
        return obj.get(attr, default)


def datetime_to_date(dt_or_d):
    return dt_or_d.date() if isinstance(dt_or_d, datetime) else dt_or_d


def weekly_generator(from_date, space_weeks, weekdays):
    weekdays = sorted(weekdays)
    if len(weekdays) == 0:
        return []
    theweek = from_date.isocalendar()[1]  # .week
    newdate = from_date + timedelta(days=1)
    while True:
        newweek = (theweek + space_weeks - 1) % 52 + 1
        while newdate.isocalendar()[1] != newweek:
            newdate += timedelta(days=7 - newdate.weekday())
        theweek = newweek
        for weekday in weekdays:
            yield newdate + timedelta(days=weekday)


def get_nth_weekday(thedate, nth, weekday):
    monthcalendar = calendar.Calendar(weekday).monthdatescalendar(thedate.year, thedate.month)
    if monthcalendar[0][0].month != thedate.month and nth < len(monthcalendar):
        return monthcalendar[nth][0]
    else:
        return monthcalendar[nth - 1][0]


def monthly_generator(from_date, space_months, day=None, nth_weekday=None):
    themonth = from_date.month
    newdate = from_date
    while True:
        newmonth = (themonth + space_months - 1) % 12 + 1
        while newdate.month != newmonth:
            newdate += timedelta(days=10)  # TODO better
        themonth = newmonth
        if day:
            yield newdate.replace(day=min(calendar.monthrange(newdate.year, newdate.month)[1], day))
        elif nth_weekday:
            nth, weekday = nth_weekday
            yield get_nth_weekday(newdate, nth, weekday)
        else:
            raise Exception('wrong method call, must send either day or nth_weekday')


def daily_generator(from_date, space_days=None, only_workdays=False):
    newdate = from_date
    while True:
        if space_days and space_days > 1:
            newdate += timedelta(days=space_days)
        else:
            newdate += timedelta(days=1)
        if only_workdays and newdate.weekday() > 4:
            continue
        yield newdate


def take(n, iterable):
    "Return first n items of the iterable as a list"
    return islice(iterable, n)


def generator_limiter(generator, limit, default_limit, infinite=True):
    if isinstance(limit, str):
        end = datetime.fromisoformat(limit).date()
        return takewhile(lambda new_date: new_date < end, generator)

    if limit is None and infinite:
        return generator

    amount = default_limit if limit is None else (limit - 1)
    return take(amount, generator)


class SchedulableModel(TimeStampedModel):
    attrs_copyable = []  # override this

    default_generation_limits = dict(  # override this if needed
        weekly=20,
        biweekly=20,
        daily=50,
        monthly=20
    )

    # fields start ###############
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    timezone = TimeZoneField(null=False, blank=False)

    parent = models.ForeignKey('self', null=True, on_delete=models.CASCADE, related_name='children')
    repeat_config = models.JSONField(null=True)

    class Meta:
        abstract = True
        ordering = ('-date', 'start_time')

    # fields end ###############

    @property
    def is_parent(self):
        return self.parent is None

    def update_myself(self, from_other):
        for attr in self.attrs_copyable:
            setattr(self, attr, get_attr_or_item(from_other, attr))

    def get_copy(self, newdate):
        data = {key: getattr(self, key) for key in self.attrs_copyable}
        return self.__class__.objects.create(parent=self, date=newdate, **data)

    def update_children_from_self(self):
        data = {key: getattr(self, key) for key in self.attrs_copyable}
        self.children.update(**data)

    def maintain_children(self, from_date=None, to_date=None):
        if self.parent is not None:
            return  # parent should maintain the childs
        childs = self.children.order_by('date').all()
        childs_set = {appm.date for appm in childs} | {self.date}
        if self.repeat_config is None:
            childs.filter(date__gt=datetime.now()).delete()
            return

        repeat_config = munchify(self.repeat_config)
        if 'weekly' in repeat_config:
            repeat_type = 'weekly'
            generator = weekly_generator(
                self.date,
                space_weeks=repeat_config.weekly.space_weeks,
                weekdays=repeat_config.weekly.weekdays
            )
        elif 'biweekly' in repeat_config:
            repeat_type = 'biweekly'
            generator = weekly_generator(
                self.date,
                space_weeks=2,
                weekdays=repeat_config.biweekly.weekdays
            )

        elif 'daily' in repeat_config:
            repeat_type = 'daily'
            generator = daily_generator(
                self.date,
                space_days=repeat_config.daily.get('space_days'),
                only_workdays=repeat_config.daily.get('only_workdays', False),
            )
        elif 'monthly' in repeat_config:
            repeat_type = 'monthly'
            generator = monthly_generator(
                self.date,
                space_months=repeat_config.monthly.space_months,
                day=repeat_config.monthly.get('day'),
                nth_weekday=tuple(repeat_config.monthly.get('nth_weekday')),
            )

        else:
            return

        limited_generator = generator_limiter(
            generator,
            repeat_config.get('end'),
            self.default_generation_limits[repeat_type],
            infinite=from_date is not None  # if end is None and we have a date range, return the whole sequence
        )
        limited_generator = (datetime_to_date(dt) for dt in limited_generator)  # make sure all are dates, and not
        # datetimes

        with transaction.atomic():
            try:
                if from_date is None:  # first time default generation
                    for newdate in limited_generator:
                        if newdate in childs_set:
                            continue  # already exists, skip
                        self.get_copy(newdate).save()
                else:
                    for newdate in limited_generator:
                        if newdate > to_date:
                            break
                        if newdate in childs_set:
                            continue  # already exists, skip
                        if newdate >= from_date:
                            self.get_copy(newdate).save()
            except StopIteration:
                pass  # no more dates, all cool, stop by limit

    def clear_children(self, exclude_older_than=None):
        if exclude_older_than is None:
            self.children.all().delete()
        else:
            self.children.exclude(date__lt=exclude_older_than).delete()

    def convert_to_parent(self, from_date=None, to_date=None):
        if self.parent is not None:
            return
        self.parent = None
        self.save()
        self.maintain_children(from_date, to_date)

    @classmethod
    @transaction.atomic
    def generate_maybe_children(cls, objects_already_in_query, from_date, to_date):
        parents = objects_already_in_query.values_list('parent_id', flat=True)
        maybes = cls.objects.filter(repeat_config__isnull=False) \
            .exclude(id__in=objects_already_in_query) \
            .exclude(id__in=parents)
        for maybe in maybes:
            # TODO optimization, skip repeated already generated if possible
            maybe.maintain_children(from_date=from_date, to_date=to_date)

'''

SCHEDULE OPTIONS:
    {"daily": {"space_days": 1}}
    {"daily": {"space_days": 1, "only_workdays": true}}
    {"weekly": {"space_weeks": 1, "weekdays": [0, 1, 2, 3, 4, 5, 6]}}
    {"biweekly": {"weekdays": [0, 1, 2, 3, 4, 5, 6]}}
    {"monthly": {"space_months": 1, "day": 1}}
    {"monthly": {"space_months": 1, "nth_weekday": [1, 0]}}

END OPTIONS:
    {"end": "2020-12-31"}
    {"end": null}
    {"end": 3}

'''


###############################
# SCHEDULE SERIALIZER STUFF ###
###############################

class ByWeeklyScheduleSerializer(serializers.Serializer):
    weekdays = serializers.ListField(
        child=serializers.IntegerField(min_value=0, max_value=6),
        min_length=1,
        max_length=7,
    )


class WeeklyScheduleSerializer(ByWeeklyScheduleSerializer):
    space_weeks = serializers.IntegerField(min_value=1, max_value=10)


class DailyScheduleSerializer(serializers.Serializer):
    space_days = serializers.IntegerField(min_value=1, max_value=600, default=1)
    only_workdays = serializers.BooleanField(default=False)


class MonthlyDayScheduleSerializer(serializers.Serializer):
    space_months = serializers.IntegerField(min_value=1, max_value=12, default=1)
    day = serializers.IntegerField(min_value=1, max_value=31, default=None, allow_null=True)


class MonthlyNthWeekdayScheduleSerializer(serializers.Serializer):
    space_months = serializers.IntegerField(min_value=1, default=1, required=False)
    day = serializers.IntegerField(min_value=1, max_value=31, required=False)
    nth_weekday = serializers.ListField(
        child=serializers.IntegerField(min_value=0, max_value=6),
        min_length=2,
        max_length=2,
        required=False,
    )

    def validate(self, data):
        day_present = data.get('day', None) is not None
        nth_weekday_present = data.get('nth_weekday', None) is not None

        if day_present and nth_weekday_present:
            raise serializers.ValidationError("Only one of 'day' or 'nth_weekday' should be provided, not both.")

        if not day_present and not nth_weekday_present:
            raise serializers.ValidationError("Either 'day' or 'nth_weekday' should be provided.")

        return data

    def validate_nth_weekday(self, value):
        nth, weekday = value
        if nth > 5:
            raise serializers.ValidationError("First Nth day invalid")
        if weekday > 6:
            raise serializers.ValidationError("Weekday invalid")
        return value


class EndField(serializers.Field):
    def to_representation(self, obj):
        if isinstance(obj, int):
            return obj
        elif isinstance(obj, date):
            return obj.isoformat()
        elif isinstance(obj, str):
            return obj
        elif obj is None:
            return None
        else:
            raise serializers.ValidationError("Invalid data type")

    def to_internal_value(self, data):
        if isinstance(data, int):
            return data
        elif isinstance(data, str):
            try:
                datetime.strptime(data, "%Y-%m-%d").date()
                return data
            except ValueError:
                raise serializers.ValidationError("Invalid date format")
        elif data is None:
            return None
        else:
            raise serializers.ValidationError("Invalid data type")


class RepeatConfigSerializer(serializers.Serializer):
    weekly = WeeklyScheduleSerializer(required=False, allow_null=False)
    biweekly = ByWeeklyScheduleSerializer(required=False, allow_null=False)
    daily = DailyScheduleSerializer(required=False, allow_null=False)
    monthly = MonthlyNthWeekdayScheduleSerializer(required=False, allow_null=False)

    end = EndField(required=False, allow_null=True, default=None)

    def validate(self, data):
        schedule_fields = ['weekly', 'biweekly', 'daily', 'monthly']
        non_empty_fields = [field for field in schedule_fields if data.get(field) is not None]

        if len(non_empty_fields) == 0:
            raise serializers.ValidationError(
                "At least one schedule field (weekly, biweekly, daily, or monthly) should be provided.")

        if len(non_empty_fields) > 1:
            raise serializers.ValidationError("Only one schedule field should be provided, not more than one.")

        return super().validate(data)


def test_serializer(data):
    print(data)
    s = RepeatConfigSerializer(data=data)
    print('valid', s.is_valid(), 'errors', s.errors)
    print(s.validated_data)

###################################
# END SCHEDULE SERIALIZER STUFF ###
###################################
