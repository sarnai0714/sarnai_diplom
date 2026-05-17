from django.contrib import admin
from .models import SiteContent



# Register your models here.
@admin.register(SiteContent)
class SiteContentAdmin(admin.ModelAdmin):
    list_display = ('page_name', 'content_key', 'updated_at') # Жагсаалтад харагдах баганууд
    search_fields = ('content_key', 'page_name') # Хайлт хийх талбарууд
    list_filter = ('page_name',) # Шүүлтүүр