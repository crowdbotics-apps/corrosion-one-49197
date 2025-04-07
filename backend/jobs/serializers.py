import os
import uuid

from cities_light.models import Country, Region
from django.conf import settings
from django.utils import timezone
from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

from inspector.models import Credential, Inspector
from inspector.serializers import CredentialSerializer, InspectorDetailSerializer, RegionSerializer, CountrySerializer
from jobs.models import Job, MagicLinkToken, JobDocument, Bid
from notifications.models import Notification
from owner.models import Industry
from owner.serializers import OwnerDetailSerializer, IndustrySerializer
from utils.utils import user_is_inspector, send_notifications
from utils.utils.email import send_email_with_template
from utils.utils.send_sms import send_sms


class JobDocumentSerializer(serializers.ModelSerializer):
    document_name = serializers.SerializerMethodField()
    size = serializers.SerializerMethodField()

    class Meta:
        model = JobDocument
        fields = ['id', 'document', 'document_name', 'size']

    def get_document_name(self, obj):
        if not obj.document:
            return None
        return os.path.basename(obj.document.name)

    def get_size(self, obj):
        if not obj.document:
            return None
        return round(obj.document.size / 1024 / 1024, 2)

class JobListSerializer(serializers.ModelSerializer):
    owner = serializers.SerializerMethodField()
    inspector = serializers.SerializerMethodField()
    bids = serializers.SerializerMethodField()
    class Meta:
        model = Job
        fields = ['id', 'title', 'created_by', 'start_date',
                  'end_date', 'status', 'views', 'created', 'bids', 'owner', 'inspector']

    def get_bids(self, obj):
        return obj.bids.count()

    def get_owner(self, obj):
        return obj.created_by.user.first_name + ' ' + obj.created_by.user.last_name if obj.created_by else None

    def get_inspector(self, obj):
        if obj.inspector:
            return obj.inspector.user.first_name + ' ' + obj.inspector.user.last_name
        return '-'

class JobDetailSerializer(serializers.ModelSerializer):
    industries = IndustrySerializer(many=True)
    certifications = CredentialSerializer(many=True)
    documents = JobDocumentSerializer(many=True)
    created_by = OwnerDetailSerializer()
    bids = serializers.SerializerMethodField()
    favorite = serializers.SerializerMethodField()
    regions = RegionSerializer(many=True)
    country = serializers.SerializerMethodField()
    bid = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = ['id', 'title', 'description', 'industries', 'certifications', 'start_date', 'address',
                  'end_date', 'status', 'created', 'documents', 'daily_rate', 'per_diem_rate', 'mileage_rate',
                  'misc_other_rate', 'payment_modes', 'created_by', 'bids', 'favorite', 'regions', 'country', 'bid',
                  'total_amount', 'days'
                  ]

    def get_bids(self, obj):
        return obj.bids.count()

    def get_favorite(self, obj):
        user = self.context['request'].user
        if not hasattr(user, 'inspector'):
            return False
        return obj.favorites.filter(inspector=user.inspector).exists()

    def get_country(self, obj):
        return CountrySerializer(Country.objects.filter(region__in=obj.regions.all()).distinct(), many=True).data

    def get_bid(self, obj):
        user = self.context['request'].user
        if not user_is_inspector(user):
            return None
        inspector = user.inspector
        bid = Bid.objects.filter(job=obj, inspector=inspector).first()
        if bid:
            return {
                'id': bid.id,
                'status': bid.status,
                'note': bid.note
            }
        return None


class JobManagementSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False, read_only=True)
    industries = PrimaryKeyRelatedField(many=True, queryset=Industry.objects.all())
    certifications = PrimaryKeyRelatedField(many=True, queryset=Credential.objects.all())
    regions = PrimaryKeyRelatedField(many=True, queryset=Region.objects.all())

    class Meta:
        model = Job
        fields = [ 'id', 'title', 'description', 'industries', 'certifications', 'start_date', 'address',
                  'end_date', 'daily_rate', 'per_diem_rate', 'mileage_rate', 'misc_other_rate', 'payment_modes',
                   'regions']

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
        documents = self.initial_data.get('documents')
        if documents:
            for document in documents:
                if 'file' in document and document['file'].size > 20 * 1024 * 1024:
                    raise serializers.ValidationError('Document size should not exceed 20MB')
            attrs['documents'] = documents
        return attrs

    def save(self, **kwargs):
        if not self.instance:
            data = self.validated_data
            user = self.context['request'].user
            data['created_by'] = user.owner
            certifications = self.validated_data['certifications']
            request = self.context.get('request')
            documents = self.validated_data.get('documents', [])
            if documents:
                data.pop('documents')
            self.instance = super().save(**kwargs)
            regions = self.validated_data.get('regions', [])
            if regions:
                self.instance.regions.set(regions)

            if documents:
                for support_document in documents:
                    if 'file' in support_document:
                        JobDocument.objects.create(job=self.instance, document=support_document['file'])
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
                # TODO: CHECK THIS LATER
                url = f'https://app.corrosionone.com/#/jtv/{magic_token.token}'
                send_email_with_template(
                    subject=f'New Job Created - {settings.PROJECT_NAME}',
                    email=user.email,
                    template_to_load='emails/new_job_email_link.html',
                    context={
                        "username": user.first_name,
                        "link": url,
                        "company_name": self.instance.created_by.company_name,
                        "job_title": self.instance.title,
                        "job_description": self.instance.description,
                        "job_start_date": self.instance.start_date,
                        "job_end_date": self.instance.end_date,
                        "job_address": self.instance.address,
                        "user_phone_number": user.phone_number.as_e164 if user.phone_number else None,
                    }
                )
                if user.phone_number:
                    message = f"Hello {user.first_name},\n\nA new job has been created. Please check your this {url} for more details.\n\nBest regards,\n{settings.PROJECT_NAME}"
                    send_sms(message, user.phone_number.as_e164)

                send_notifications(
                    users=[user],
                    title=f'New Job Available - {self.instance.title}',
                    description=f'A new job has been created. Please check your email for more details.',
                    extra_data={
                        'job_id': self.instance.id,
                        'url': url
                    },
                    n_type=Notification.NotificationType.JOB_AVAILABLE,
                    channel=Notification.NotificationChannel.EMAIL,
                )

        else:
            data = self.validated_data
            user = self.context['request'].user
            data['created_by'] = user.owner
            documents = self.validated_data.get('documents', [])
            if documents:
                self.validated_data.pop('documents')
                current_documents_ids = self.instance.documents.all().values_list('id', flat=True)
                for document in current_documents_ids:
                    if document not in [doc['id'] for doc in documents]:
                        JobDocument.objects.get(id=document).delete()
                for support_document in documents:
                    if 'file' in support_document:
                        JobDocument.objects.create(job=self.instance, document=support_document['file'])
            self.instance = super().save(**kwargs)
        return self.instance


class BidListSerializer(serializers.ModelSerializer):
    job = serializers.CharField(source='job.title')
    inspector = serializers.CharField(source='inspector.name')

    class Meta:
        model = Bid
        fields = ['id', 'job', 'inspector', 'status', 'note']


class BidCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bid
        fields = ['job', 'note']

    def validate(self, attrs):
        user = self.context['request'].user
        if not hasattr(user, 'inspector'):
            raise serializers.ValidationError('User is not an inspector')
        attrs['inspector'] = user.inspector
        job = attrs['job']
        if job.status != Job.JobStatus.PENDING:
            raise serializers.ValidationError('Job is not available for bidding')
        if Bid.objects.filter(job=job, inspector=user.inspector).exists():
            raise serializers.ValidationError('You have already bid for this job')
        return attrs

    def save(self, **kwargs):
        data = self.validated_data
        job = data.get('job')
        user = job.created_by.user
        send_notifications(
            users=[user],
            title=f'New Bid Created- {job.title}',
            description=f'A new bid has been created',
            extra_data={
                'job_id': job.id,
            },
            n_type=Notification.NotificationType.NEW_BID,
            channel=Notification.NotificationChannel.EMAIL,
        )
        return super().save(**kwargs)


class BidDetailSerializer(serializers.ModelSerializer):
    job = JobListSerializer()
    inspector = InspectorDetailSerializer()

    class Meta:
        model = Bid
        fields = ['job', 'inspector', 'status', 'note']