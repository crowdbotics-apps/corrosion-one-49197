from django.conf import settings
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
    categories = JobCategorySerializer(many=True)
    certifications = CredentialSerializer(many=True)
    class Meta:
        model = Job
        fields = ['id', 'title', 'description', 'categories', 'created_by', 'certifications', 'start_date',
                  'end_date', 'status']



class JobManagementSerializer(serializers.ModelSerializer):
    categories = PrimaryKeyRelatedField(many=True, queryset=JobCategory.objects.all())
    certifications = PrimaryKeyRelatedField(many=True, queryset=Credential.objects.all())
    class Meta:
        model = Job
        fields = [ 'title', 'description', 'categories', 'certifications', 'start_date',
                  'end_date']

    def validate(self, attrs):
        if attrs['start_date'] > attrs['end_date']:
            raise serializers.ValidationError('End date should be greater than start date')
        return attrs

    def save(self, **kwargs):
        if not self.instance:
            data = self.validated_data
            user = self.context['request'].user
            data['created_by'] = user.owner
            certifications = self.validated_data['certifications']
            request = self.context.get('request')
            inspector_ids =  []
            for certification in certifications:
                inspector_ids_credential = list(certification.documents.values_list('inspector_id', flat=True))
                inspector_ids.extend(inspector_ids_credential)
            inspector_ids_to_send = list(set(inspector_ids))
            for inspector_id in inspector_ids_to_send:
                user = Inspector.objects.get(id=inspector_id).user

                magic_token = MagicLinkToken.objects.create(user=user)
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




        return super().save(**kwargs)