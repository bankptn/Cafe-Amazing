from django.contrib import admin

# Register your models here.
from .models import PaymentMethod
from .models import Customer
from .models import Invoice
from .models import Receipt
from .models import ReceiptLineItem

admin.site.register(Customer)
admin.site.register(Invoice)
admin.site.register(Receipt)
admin.site.register(ReceiptLineItem)
