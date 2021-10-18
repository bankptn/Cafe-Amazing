from django.db import models

# Create your models here.
# class Product(models.Model):
#     code = models.CharField(max_length=10, primary_key=True)
#     name = models.CharField(max_length=100, null=True)
#     units = models.CharField(max_length=10, null=True)

#     class Meta:
#         db_table = "product"
#         managed = False
#     def __str__(self):
#         return self.code

# class Customer(models.Model):
#     customer_code = models.CharField(max_length=10, primary_key=True)
#     name = models.CharField(max_length=100, null=True)
#     address = models.CharField(max_length=100, null=True, blank=True)
#     credit_limit = models.FloatField(null=True, blank=True)
#     country = models.CharField(max_length=20, null=True, blank=True)
    
#     class Meta:
#         db_table = "customer"
#         managed = False
#     def __str__(self):
#         return self.customer_code

# class Invoice(models.Model):
#     invoice_no = models.CharField(max_length=10, primary_key=True)
#     date = models.DateField(null=True)
#     customer_code = models.ForeignKey(Customer, on_delete=models.CASCADE, db_column='customer_code')
#     due_date = models.DateField(null=True, blank=True)
#     total = models.FloatField(null=True, blank=True)
#     vat = models.FloatField(null=True, blank=True)
#     amount_due = models.FloatField(null=True, blank=True)

#     class Meta:
#         db_table = "invoice"
#         managed = False

# class InvoiceLineItem(models.Model):
#     lineitem = models.IntegerField()
#     invoice_no = models.ForeignKey(Invoice, on_delete=models.CASCADE, db_column='invoice_no')
#     product_code = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='product', db_column='product_code')
#     quantity = models.IntegerField(null=True)
#     unit_price = models.FloatField(null=True)
#     extended_price = models.FloatField(null=True)

#     class Meta:
#         db_table = "invoice_line_item"
#         unique_together = (("lineitem", "invoice_no"),)
#         managed = False


class Employee(models.Model):
    user_id = models.CharField(max_length=10, primary_key=True)
    employee_first_name = models.CharField(max_length=100, null=True)
    minit = models.CharField(max_length=10, null=True)
    employee_last_name = models.CharField(max_length=100, null=True)
    employee_phone_number = models.CharField(max_length=10, null=True)
    employee_email = models.CharField(max_length=10, null=True)
    sex = models.CharField(max_length=1, null=True)
    bday = models.DateField(null=True, blank=True)
    address = models.CharField(max_length=100, null=True, blank=True)
    salary = models.FloatField(null=True, blank=True)
    password = models.CharField(max_length=20, null=True)
    
    class Meta:
        db_table = "employee"
        managed = False
    def __str__(self):
        return self.user_id

class Customer(models.Model):
    club_id = models.CharField(max_length=10, primary_key=True)
    first_name = models.CharField(max_length=100, null=True)
    minit = models.CharField(max_length=10, null=True)
    last_name = models.CharField(max_length=100, null=True)
    phone_number = models.CharField(max_length=10, null=True)
    email = models.CharField(max_length=10, null=True)
    sex = models.CharField(max_length=1, null=True)
    bday = models.DateField(null=True, blank=True)
    address = models.CharField(max_length=100, null=True, blank=True)
    point = models.CharField(max_length=10, blank=True)
    
    class Meta:
        db_table = "customer"
        managed = False
    def __str__(self):
        return self.club_id

class PaymentMethod(models.Model):
    code = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=100, null=True)

    class Meta:
        db_table = "payment_method"
        managed = False
    def __str__(self):
        return self.code

class Menu(models.Model):
    code = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=100, null=True)
    types = models.CharField(max_length=10, null=True)
    price = models.FloatField(null=True, blank=True)

    class Meta:
        db_table = "menu"
        managed = False
    def __str__(self):
        return self.code

class Invoice(models.Model):
    invoice_no = models.CharField(max_length=10, primary_key=True)
    invoice_date = models.DateField(null=True)
    club_id = models.ForeignKey(Customer, on_delete=models.CASCADE, db_column='club_id')
    total = models.FloatField(null=True, blank=True)
    tax = models.FloatField(null=True, blank=True)
    amount_due = models.FloatField(null=True, blank=True)
    point_use = models.FloatField(null=True, blank=True)
    change = models.FloatField(null=True, blank=True)
    point_received = models.FloatField(null=True, blank=True)
    payment_method = models.CharField(max_length=30, null=True)
    payment_reference = models.CharField(max_length=30, null=True)
    amount_paid = models.FloatField(null=True, blank=True)
    point_to_baht = models.FloatField( null=True)

    class Meta:
        db_table = "invoice"
        managed = False

class InvoiceLineItem(models.Model):
    lineitem = models.IntegerField()
    invoice_no = models.ForeignKey(Invoice, on_delete=models.CASCADE, db_column='invoice_no')
    menu_code = models.CharField(max_length=10, null=True)
    menu_name = models.CharField(max_length=25, null=True)
    menu_types = models.CharField(max_length=25, null=True)
    quantity = models.IntegerField(null=True)
    unit_price = models.FloatField(null=True)
    extended_price = models.FloatField(null=True)
    # point_use = models.FloatField(blank=True)
    # amount_paid = models.FloatField(blank=True)
    

    class Meta:
        db_table = "invoice_line_item"
        unique_together = (("lineitem", "invoice_no"),)
        managed = False
