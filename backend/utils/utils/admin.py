from django.contrib import admin
from django.utils.html import format_html


def register_classes_to_admin(*args_or_iterables):
    for klass in args_or_iterables:
        @admin.register(klass)
        class GenericClassAdmin(admin.ModelAdmin):
            pass

            def get_queryset(self, request):
                if hasattr(self.model, 'all_objects') and request.GET.get('all', None) == 'true':
                    return self.model.all_objects.all()
                return self.model.objects.all()


def admin_link(href, content):
    return format_html(f'<a href="{href}">{content}</a>')
