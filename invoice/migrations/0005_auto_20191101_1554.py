# Generated by Django 2.2.2 on 2019-11-01 15:54

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('invoice', '0004_invoicelineitem'),
    ]

    operations = [
        migrations.AlterField(
            model_name='invoicelineitem',
            name='product_code',
            field=models.CharField(max_length=10),
        ),
        migrations.DeleteModel(
            name='Product',
        ),
    ]
