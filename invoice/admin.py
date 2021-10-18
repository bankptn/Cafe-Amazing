from django.contrib import admin

# Register your models here.
from .models import Menu
from .models import Customer
from .models import Invoice
from .models import InvoiceLineItem

admin.site.register(Menu)
admin.site.register(Customer)
admin.site.register(Invoice)
admin.site.register(InvoiceLineItem)