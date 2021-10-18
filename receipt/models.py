from django.db import models

# Create your models here.
class PaymentMethod(models.Model):
    code = models.CharField(max_length=10, primary_key=True)
    name = models.CharField(max_length=100, null=True)

    class Meta:
        db_table = "payment_method"
        managed = False
    def __str__(self):
        return self.code

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
    
    class Meta:
        db_table = "customer"
        managed = False
    def __str__(self):
        return self.club_id

class Invoice(models.Model):
    invoice_no = models.CharField(max_length=10, primary_key=True)
    invoice_date = models.DateField(null=True)
    club_id = models.ForeignKey(Customer, on_delete=models.CASCADE, db_column='club_id')
    user_id = models.ForeignKey(Employee, on_delete=models.CASCADE, db_column='user_id')
    total = models.FloatField(null=True, blank=True)
    tax = models.FloatField(null=True, blank=True)
    amount_due = models.FloatField(null=True, blank=True)

    class Meta:
        db_table = "invoice"
        managed = False

class Receipt(models.Model):
    receipt_no = models.CharField(max_length=10, primary_key=True)
    receipt_date = models.DateField(null=True, blank=True)
    club_id = models.ForeignKey(Customer, on_delete=models.CASCADE, db_column='club_id')
    user_id = models.ForeignKey(Employee, on_delete=models.CASCADE, db_column='user_id')
    payment_method = models.CharField(max_length=30, null=True)
    payment_reference = models.CharField(max_length=30, null=True)
    remarks = models.CharField(max_length=100, null=True)
    total_received = models.FloatField(null=True, blank=True)
    
    class Meta:
        db_table = "receipt"
        managed = False

class ReceiptLineItem(models.Model):
    lineitem = models.IntegerField()
    receipt_no = models.ForeignKey(Receipt, on_delete=models.CASCADE, db_column='receipt_no')
    invoice_no = models.ForeignKey(Invoice, on_delete=models.CASCADE, db_column='invoice_no')
    amount_paid = models.FloatField(null=True, blank=True)
    change = models.FloatField(null=True, blank=True)
    point = models.FloatField(null=True, blank=True)
    class Meta:
        db_table = "receipt_line_item"
        unique_together = (("lineitem", "receipt_no"),)
        managed = False