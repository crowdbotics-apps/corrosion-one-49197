from django.contrib import admin

# Register your models here.

from jobs.models import Job, JobCategory, Bid

@admin.register(Job)
class JobCategoryAdmin(admin.ModelAdmin):
    list_display = ['title', 'description', 'active', 'start_date', 'end_date', 'status', 'created_by', 'inspector']
    search_fields = ['title', 'description']
    list_filter = ['title', 'active', 'status']

@admin.register(JobCategory)
class JobCategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'description']
    search_fields = ['name', 'description']

@admin.register(Bid)
class BidAdmin(admin.ModelAdmin):
    list_display = ['job', 'inspector', 'status', 'note']
    search_fields = ['job__title', 'inspector__user__name', 'status', 'note']
    list_filter = ['status']
