from django.contrib import admin

# Register your models here.

from payments.models import Transaction

@admin.register(Transaction)
class TransactionAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "amount",
        "currency",
        "created",
        "modified",
        "status",
        "transaction_type",
        "created_by",
        "recipient",
    )
    list_filter = ("status", "transaction_type")
    search_fields = ("id", "created_by__email", "recipient__email")
    ordering = ("-created",)