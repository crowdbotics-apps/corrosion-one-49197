from django.contrib import admin

from inspector.models import Inspector, Credential, Language


@admin.register(Credential)
class CredentialAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'description']
    search_fields = ['name', 'description']


@admin.register(Inspector)
class InspectorAdmin(admin.ModelAdmin):
    list_display = ['id', 'user__first_name', 'user__last_name', 'user__email', 'user__phone_number', 'status',
                    'work_area', 'credential']
    search_fields = ['user__first_name', 'user__last_name', 'user__email', 'user__phone_number']
    list_filter = [
        ('regions', admin.RelatedOnlyFieldListFilter),
        ('credentials', admin.RelatedOnlyFieldListFilter),
    ]

    @admin.display(description='First Name')
    def user__first_name(self, obj):
        return obj.user.first_name

    @admin.display(description='Last Name')
    def user__last_name(self, obj):
        return obj.user.last_name

    @admin.display(description='Email')
    def user__email(self, obj):
        return obj.user.email

    @admin.display(description='Phone Number')
    def user__phone_number(self, obj):
        return obj.user.phone_number


    @admin.display(description='Registration Status')
    def status(self, obj):
        user = obj.user
        if not user.phone_verified:
            return 'Phone number not verified'
        if not user.first_name or not user.last_name:
            return 'Missing personal data'
        if not obj.regions.exists():
            return 'Missing work area'
        return 'Completed'

    @admin.display(description='Work Area')
    def work_area(self, obj):
        if not obj.regions.exists():
            return '-'
        return ', '.join(region.name for region in obj.regions.all() if region.name)

    @admin.display(description='Credentials')
    def credential(self, obj):
        return ', '.join([credential.name for credential in obj.credentials.all()]) if obj.credentials.exists() else '-'


admin.site.register(Language)
