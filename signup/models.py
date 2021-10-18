from django.db import models
# Create your models here.

class Customer(models.Model):
    club_id = models.CharField(max_length=7, primary_key=True)
    first_name = models.CharField(max_length=15, null=True)
    minit = models.CharField(max_length=1, null=True)
    last_name = models.CharField(max_length=15, null=True)
    phone_number = models.CharField(max_length=10, null=True)
    email = models.CharField(max_length=50, null=True)
    sex = models.CharField(max_length=6, null=True)
    bday = models.DateField(null=True, blank=True)
    address = models.CharField(max_length=250, null=True, blank=True)
    point = models.CharField(max_length=5, null=True)

    class Meta:
        db_table = "customer"
        managed = False
    def __str__(self):
        return self.club_id
