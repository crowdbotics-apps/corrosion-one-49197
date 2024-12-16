from collections.abc import Mapping
from typing import Type

from django.conf import settings
from django.db.models import IntegerChoices, TextChoices
from drf_extra_fields.relations import ReadSourceMixin, PresentablePrimaryKeyRelatedField
from munch import munchify
from rest_framework import parsers, serializers
from django.utils.translation import gettext_lazy as _


def file_or_image_to_representation(value, context,
                                    use_url=settings.REST_FRAMEWORK.get('UPLOADED_FILES_USE_URL', True)):
    if not value:
        return None

    if use_url:
        try:
            url = value.url
        except AttributeError:
            return None
        request = context.get('request', None)
        if request is not None:
            return request.build_absolute_uri(url)
        return url

    return value.name


class OptionallyNestedRelatedFieldSerializer(serializers.PrimaryKeyRelatedField):
    def __init__(self, **kwargs):
        self.pk_input_field = kwargs.pop("pk_input_field", None)
        self.allow_just_pk = kwargs.pop("allow_just_pk", True)
        self.pk_parser_class = kwargs.pop("pk_parser_class", int)
        assert self.pk_input_field is not None, (
                self.__class__.__name__
                + " must provide a `pk_input_field` argument"
        )
        super().__init__(**kwargs)

    def to_internal_value(self, data):
        if not isinstance(data, Mapping) and not self.allow_just_pk:
            self.fail('invalid format', pk_value=data)
        try:
            pk = data[self.pk_input_field]
        except (KeyError, TypeError):
            if self.allow_just_pk:
                pk = data
            else:
                self.fail('key_not_found', pk_value=data)

        try:
            pk = self.pk_parser_class(pk) if self.pk_parser_class else pk
        except Exception:
            self.fail('invalid', pk_value=data)

        return super().to_internal_value(pk)


class PresentableOptionallyNestedIdRelatedFieldSerializer(OptionallyNestedRelatedFieldSerializer,
                                                          PresentablePrimaryKeyRelatedField):

    def __init__(self, **kwargs):
        kwargs['pk_input_field'] = 'id'
        super().__init__(**kwargs)


def IntegerChoicesSerializer(choice_class: Type[IntegerChoices] = None, value_repr_name='id', label_repr_name='label',
                             value_field_source='value', label_field_source=None):
    class IntegerChoicesSerializerImpl(serializers.Serializer):
        default_error_messages = {
            'invalid': _('invalid value'),
        }

        class Meta:
            fields = [value_repr_name, label_repr_name]

        def get_fields(self):
            return {
                value_repr_name: serializers.IntegerField(source=value_field_source),
                label_repr_name: serializers.CharField(source=label_field_source)
            }

        def to_internal_value(self, data):
            if choice_class is None:
                return super().to_internal_value(data)

            if isinstance(data, Mapping):
                data = data.get(value_repr_name, None)
                if data is None:
                    self.fail('invalid')

            try:
                value = int(data)
                return choice_class(value)
            except ValueError:
                self.fail('invalid')

    return IntegerChoicesSerializerImpl


def TextChoicesSerializer(choice_class: Type[TextChoices] = None, value_repr_name='id', label_repr_name='label',
                          value_field_source='value', label_field_source=None):
    class TextChoicesSerializerImpl(serializers.Serializer):
        default_error_messages = {
            'invalid': _('invalid value'),
        }

        class Meta:
            fields = [value_repr_name, label_repr_name]

        def get_fields(self):
            return {
                value_repr_name: serializers.CharField(source=value_field_source),
                label_repr_name: serializers.CharField(source=label_field_source)
            }

        def to_internal_value(self, data):
            if choice_class is None:
                return super().to_internal_value(data)

            if isinstance(data, Mapping):
                data = data.get(value_repr_name, None)
                if data is None:
                    self.fail('invalid')

            try:
                return choice_class(data)
            except ValueError:
                self.fail('invalid')

    return TextChoicesSerializerImpl


class MunchifyDataSerializerMixin:
    @property
    def validated_data(self):
        return munchify(super().validated_data)

    @property
    def data(self):
        return munchify(super().data)