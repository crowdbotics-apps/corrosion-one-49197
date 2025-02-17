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
    pass