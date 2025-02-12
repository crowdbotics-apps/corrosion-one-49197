from django.contrib import admin

# Register your models here.


from .models import Owner, Industry

admin.site.register(Owner)
admin.site.register(Industry)
