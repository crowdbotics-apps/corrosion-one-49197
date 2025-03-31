import os
import uuid


from django.conf import settings
from django.utils import timezone
from rest_framework import serializers
from rest_framework.relations import PrimaryKeyRelatedField

from inspector.models import Credential, Inspector
from inspector.serializers import CredentialSerializer, InspectorDetailSerializer
from jobs.models import Job, JobCategory, MagicLinkToken, JobDocument, Bid
from owner.serializers import OwnerDetailSerializer
from utils.utils.email import send_email_with_template


class JobCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = JobCategory
        fields = ['id', 'name', 'description']

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

    bids = serializers.SerializerMethodField()
    class Meta:
        model = Job
        fields = ['id', 'title', 'created_by', 'start_date',
                  'end_date', 'status', 'views', 'created', 'bids', 'owner']

    def get_bids(self, obj):
        return obj.bids.count()

    def get_owner(self, obj):
        return obj.created_by.user.first_name + ' ' + obj.created_by.user.last_name if obj.created_by else None

class JobDetailSerializer(serializers.ModelSerializer):
    categories = JobCategorySerializer(many=True)
    certifications = CredentialSerializer(many=True)
    documents = JobDocumentSerializer(many=True)
    created_by = OwnerDetailSerializer()
    bids = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = ['id', 'title', 'description', 'categories', 'certifications', 'start_date', 'address',
                  'end_date', 'status', 'created', 'documents', 'daily_rate', 'per_diem_rate', 'mileage_rate',
                  'misc_other_rate', 'payment_modes', 'created_by', 'bids']

    def get_bids(self, obj):
        return obj.bids.count()

class JobManagementSerializer(serializers.ModelSerializer):
    categories = PrimaryKeyRelatedField(many=True, queryset=JobCategory.objects.all())
    certifications = PrimaryKeyRelatedField(many=True, queryset=Credential.objects.all())
    class Meta:
        model = Job
        fields = [ 'title', 'description', 'categories', 'certifications', 'start_date', 'address',
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
                send_email_with_template(
                    subject=f'New Job Created - {settings.PROJECT_NAME}',
                    email=user.email,
                    template_to_load='emails/new_job_email_link.html',
                    context={
                        "username": user.email,
                        "link": url,
                    }
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
        return super().save(**kwargs)


class BidDetailSerializer(serializers.ModelSerializer):
    job = JobListSerializer()
    inspector = InspectorDetailSerializer()

    class Meta:
        model = Bid
        fields = ['job', 'inspector', 'status', 'note']