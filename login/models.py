from django.db import models

# Create your models here.
class EmployeeLogIn(models.Model):
    user_id = models.CharField(max_length=100, null=True)
    password = models.CharField(max_length=100, null=True)

    class Meta:
        db_table = "employee"
        managed = False
    def __str__(self):
        return self.user_id

class Employee(models.Model):
    user_id = models.CharField(max_length=7, primary_key=True)
    employee_first_name = models.CharField(max_length=15, null=True)
    minit = models.CharField(max_length=1, null=True)
    employee_last_name = models.CharField(max_length=15, null=True)
    employee_phone_number = models.CharField(max_length=10, null=True)
    employee_email = models.CharField(max_length=50, null=True)
    sex = models.CharField(max_length=1, null=True)
    bday = models.DateField(null=True, blank=True)
    address = models.CharField(max_length=250, null=True, blank=True)
    salary = models.FloatField(max_length=5, null=True)
    password = models.CharField(max_length=20, null=True)
    
    class Meta:
        db_table = "employee"
        managed = False
    def __str__(self):
        return self.user_id