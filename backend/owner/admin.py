from django.contrib import admin

# Register your models here.


from .models import Owner, Industry

# admin.site.register(Owner)


@admin.register(Industry)
class IndustryAdmin(admin.ModelAdmin):
    list_display = ['id', 'name', 'description']
    search_fields = ['name', 'description']


@admin.register(Owner)
class OwnerAdmin(admin.ModelAdmin):
    list_display = ['id', 'user__first_name', 'user__last_name', 'user__email', 'user__phone_number', 'status',
                    'company_name', 'industry']
    search_fields = ['user__first_name', 'user__last_name', 'user__email', 'user__phone_number']
    list_filter = [
        ('industry', admin.RelatedOnlyFieldListFilter),
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
        if not obj.company_name:
            return 'Missing personal data'
        if not user.phone_verified:
            return 'Phone number not verified'
        return 'Completed'