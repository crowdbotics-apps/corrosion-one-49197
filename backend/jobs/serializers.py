import uuid


from django.conf import settings
from django.utils import timezone
from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

from inspector.models import Credential, Inspector
from inspector.serializers import CredentialSerializer
from jobs.models import Job, JobCategory, MagicLinkToken
from utils.utils.email import send_email_with_template


class JobCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = JobCategory
        fields = ['id', 'name', 'description']



class JobListSerializer(serializers.ModelSerializer):

    bids = serializers.SerializerMethodField()
    class Meta:
        model = Job
        fields = ['id', 'title', 'created_by', 'start_date',
                  'end_date', 'status', 'views', 'created', 'bids']

    def get_bids(self, obj):
        return obj.bids.count()


class JobManagementSerializer(serializers.ModelSerializer):
    categories = PrimaryKeyRelatedField(many=True, queryset=JobCategory.objects.all())
    certifications = PrimaryKeyRelatedField(many=True, queryset=Credential.objects.all())
    class Meta:
        model = Job
        fields = [ 'title', 'description', 'categories', 'certifications', 'start_date',
                  'end_date', 'daily_rate', 'per_diem_rate', 'mileage_rate', 'misc_other_rate', 'payment_modes']

    def validate(self, attrs):
        if attrs['start_date'] > attrs['end_date']:
            raise serializers.ValidationError('End date should be greater than start date')
        if attrs['start_date'] < timezone.now().date():
            raise serializers.ValidationError('Start date should be greater than yesterday')
        payment_modes = attrs['payment_modes']
        rate_fields = {
            Job.PaymentMode.DAILY: 'daily_rate',
            Job.PaymentMode.PER_DIEM: 'per_diem_rate',
            Job.PaymentMode.MILEAGE: 'mileage_rate',
            Job.PaymentMode.MISC_OTHER: 'misc_other_rate'
        }
        for mode, rate_field in rate_fields.items():
            if mode in payment_modes and attrs.get(rate_field, 0) == 0:
                raise serializers.ValidationError(
                    f'{rate_field.replace("_", " ").title()} cannot be 0 if {mode.replace("_", " ")} payment mode is selected')

        return attrs

    def save(self, **kwargs):
        if not self.instance:
            data = self.validated_data
            user = self.context['request'].user
            data['created_by'] = user.owner
            certifications = self.validated_data['certifications']
            request = self.context.get('request')
            self.instance = super().save(**kwargs)
            inspector_ids =  []
            for certification in certifications:
                inspector_ids_credential = list(certification.documents.values_list('inspector_id', flat=True))
                inspector_ids.extend(inspector_ids_credential)
            inspector_ids_to_send = list(set(inspector_ids))
            for inspector_id in inspector_ids_to_send:
                user = Inspector.objects.get(id=inspector_id).user

                magic_token = MagicLinkToken.objects.create(
                    user=user,
                    token=str(uuid.uuid4()) + '-' + str(self.instance.id)
                )
                url = f"{request.scheme}://{request.get_host()}/#/jtv/{magic_token.token}"
                send_email_with_template(
                    subject=f'New Job Created - {settings.PROJECT_NAME}',
                    email=user.email,
                    template_to_load='emails/new_job_email_link.html',
                    context={
                        "username": user.email,
                        "link": url,
                    }
                )




        return self.instance