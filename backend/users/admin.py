from django.conf import settings
from django.contrib import admin
from django.contrib.auth import admin as auth_admin
from django.contrib.auth import get_user_model
from django.core.mail import send_mail
from django.db.models import Q
from django.http import HttpResponseRedirect

from users.forms import UserChangeForm, UserCreationForm
from users.models import UserVerificationCode, SupportEmail
from utils.utils import user_is_inspector

User = get_user_model()


class UserVerificationCodeAdmin(admin.ModelAdmin):
    pass


admin.site.register(UserVerificationCode, UserVerificationCodeAdmin)


# @admin.register(User)
# class UserAdmin(admin.ModelAdmin):
#     form = UserChangeForm
#     add_form = UserCreationForm
#     fieldsets = (("User", {"fields": ("phone_number", "phone_verified")}),) + auth_admin.UserAdmin.fieldsets
#     list_display = ["username", "phone_number", "is_superuser","is_staff", "phone_verified", "profile_picture"]
#     search_fields = ["username", "phone_number"]
#     list_filter = ["is_superuser"]
#
#     def get_queryset(self, request):
#         qs = super().get_queryset(request)
#         if request.user.is_superuser:
#             return qs
#         return qs.filter(Q(is_superuser=False) & Q(is_staff=False))
#
#     def get_form(self, request, obj=None, **kwargs):
#         form = super().get_form(request, obj, **kwargs)
#         if not request.user.is_superuser:
#             form.base_fields["is_superuser"].disabled = True
#             form.base_fields["is_staff"].disabled = True
#         return form

@admin.register(SupportEmail)
class SupportEmailAdmin(admin.ModelAdmin):
    list_display = ["subject", "user", "user_type", "answered", "answered_by", "created"]
    search_fields = ["subject", "user__username"]
    list_filter = ["answered"]

    # What fields to display/edit on the detail form:
    fields = ("subject", "user", "description", "answer", "answered", "answered_by")

    # Some of those could be read-only if you prefer:
    readonly_fields = ("subject", "user", "description", "answered", "answered_by")

    # Use a custom template for the change form.
    change_form_template = "admin/supportemail_change_form.html"

    def get_readonly_fields(self, request, obj=None):
        if obj and obj.answered:
            return self.readonly_fields + ("answer",)
        return self.readonly_fields

    def user_type(self, obj):
        if user_is_inspector(obj.user):
            return "Inspector"
        return "Owner"

    user_type.short_description = "User Type"

    def response_change(self, request, obj):
        """
        Runs after the user clicks any button in the change form.
        We look for our custom button in request.POST.
        """
        if "_sendemail" in request.POST:
            # If there's an answer, send it to the user
            if obj.answered:
                self.message_user(request, "This email has already been answered.", level="error")
                return HttpResponseRedirect(".")
            if obj.answer:
                send_mail(
                    subject=f"Re: {obj.subject}",
                    message=obj.answer,
                    from_email=settings.DEFAULT_FROM_EMAIL,
                    recipient_list=[obj.user.email],  # send to the user who made the support request
                )

                # Mark as answered, record who answered
                obj.answered = True
                obj.answered_by = request.user
                obj.save()

                self.message_user(request, "Support email replied successfully.")
            else:
                self.message_user(request, "Please enter an answer before sending.", level="error")

            # Redirect back to the same change form
            return HttpResponseRedirect(".")

        # Otherwise, use the default behavior (e.g., Save, Save & continue, etc.)
        return super().response_change(request, obj)



admin.site.register(User, auth_admin.UserAdmin)