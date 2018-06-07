from django.contrib import admin
from .models import poems,poems_author,poetry,poetry_author

# Register your models here.
admin.site.register(poetry)
admin.site.register(poems)
admin.site.register(poems_author)
admin.site.register(poetry_author)