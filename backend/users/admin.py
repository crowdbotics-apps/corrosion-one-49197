from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import get_user_model
from django.db.models import Q

from users.forms import UserChangeForm, UserCreationForm
from users.models import UserVerificationCode

User = get_user_model()


class UserVerificationCodeAdmin(admin.ModelAdmin):
    pass


admin.site.register(UserVerificationCode, UserVerificationCodeAdmin)


@admin.register(User)
class UserAdmin(auth_admin.UserAdmin):
    form = UserChangeForm
    add_form = UserCreationForm
    fieldsets = (("User", {"fields": ("phone_number", "phone_verified")}),) + auth_admin.UserAdmin.fieldsets
    list_display = ["username", "phone_number", "is_superuser","is_staff", "phone_verified", "profile_picture"]
    search_fields = ["username", "phone_number"]
    list_filter = ["is_superuser"]

    def get_queryset(self, request):
        qs = super().get_queryset(request)
        if request.user.is_superuser:
            return qs
        return qs.filter(Q(is_superuser=False) & Q(is_staff=False))

    def get_form(self, request, obj=None, **kwargs):
        form = super().get_form(request, obj, **kwargs)
        if not request.user.is_superuser:
            form.base_fields["is_superuser"].disabled = True
            form.base_fields["is_staff"].disabled = True
        return form