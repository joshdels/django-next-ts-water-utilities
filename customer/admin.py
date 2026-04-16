from django.contrib import admin
from .models import PotentialCustomer

@admin.register(PotentialCustomer)
class PotentialCustomerAdmin(admin.ModelAdmin):
    def get_list_display(self, request):
        return [field.name for field in self.model._meta.fields]
