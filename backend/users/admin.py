from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import get_user_model
from django.db.models import Q

from users.forms import UserChangeForm, UserCreationForm

User = get_user_model()


# @admin.register(User)
# class UserAdmin(auth_admin.UserAdmin):
#
#     form = UserChangeForm
#     add_form = UserCreationForm
#     list_display = ["username", "name", "is_superuser", 'is_active']
#     search_fields = ["name"]
#
