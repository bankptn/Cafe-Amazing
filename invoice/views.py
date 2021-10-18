from django.shortcuts import render
from django.http import HttpResponse

from django.shortcuts import get_object_or_404
from django.views.generic import View
from django.http import JsonResponse
from django import forms
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.forms.models import model_to_dict
from django.db.models import Max
from django.db import connection
from invoice.models import *
import json

# Create your views here.
def index(request):
    data = {}
    return render(request, 'invoice/invoice.html', data)

# class ProductList(View):
#     def get(self, request):
#         products = list(Product.objects.all().values())
#         data = dict()
#         data['products'] = products
#         response = JsonResponse(data)
#         response["Access-Control-Allow-Origin"] = "*"
#         return response

class MenuList(View):
    def get(self, request):
        menus = list(Menu.objects.all().values())
        data = dict()
        data['menus'] = menus
        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response

class PaymentList(View):
    def get(self, request):
        payments = list(PaymentMethod.objects.all().values())
        data = dict()
        data['payments'] = payments
        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response

class PaymentDetail(View):
    def get(self, request, pk):
        payment = get_object_or_404(PaymentMethod, pk=pk)
        data = dict()
        data['payments'] = model_to_dict(payment)
        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response

class CustomerList(View):
    def get(self, request):
        customers = list(Customer.objects.all().values())
        data = dict()
        data['customers'] = customers
        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response

class CustomerDetail(View):
    def get(self, request, pk):
        customer = get_object_or_404(Customer, pk=pk)
        data = dict()
        data['customers'] = model_to_dict(customer)
        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response

class InvoiceList(View):
    def get(self, request):
        invoices = list(Invoice.objects.order_by('invoice_no').all().values())
        data = dict()
        data['invoices'] = invoices
        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response

class InvoiceDetail(View):
    def get(self, request, pk, pk2):
        invoice_no = pk + "/" + pk2

        invoice = list(Invoice.objects.select_related("customer").filter(invoice_no=invoice_no).values('invoice_no', 'invoice_date', 'club_id','club_id__first_name','total','tax','amount_due','point_use','change','point_received','payment_method','payment_reference','amount_paid','point_to_baht'))
        invoicelineitem = list(InvoiceLineItem.objects.select_related('menu_code').filter(invoice_no=invoice_no).order_by('lineitem').values("lineitem","invoice_no","menu_code","menu_name","menu_types","unit_price","quantity","extended_price"))

        data = dict()
        data['invoice'] = invoice[0]
        data['invoicelineitem'] = invoicelineitem

        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response

class InvoiceForm(forms.ModelForm):
    class Meta:
        model = Invoice
        fields = '__all__'

class InvoiceLineItemForm(forms.ModelForm):
    class Meta:
        model = InvoiceLineItem
        fields = '__all__'

@method_decorator(csrf_exempt, name='dispatch')
class InvoiceCreate(View):
    def post(self, request):
        data = dict()
        request.POST = request.POST.copy()
        if Invoice.objects.count() != 0:
            invoice_no_max = Invoice.objects.aggregate(Max('invoice_no'))['invoice_no__max']
            next_invoice_no = invoice_no_max[0:3] + str(int(invoice_no_max[3:6])+1) + "/" + invoice_no_max[7:9]
        else:
            next_invoice_no = "INT100/20"
        request.POST['invoice_no'] = next_invoice_no
        request.POST['invoice_date'] = reFormatDateMMDDYYYY(request.POST['invoice_date'])
        request.POST['total'] = reFormatNumber(request.POST['total'])
        request.POST['tax'] = reFormatNumber(request.POST['tax'])
        request.POST['amount_due'] = reFormatNumber(request.POST['amount_due'])
        request.POST['point_use'] = reFormatNumber(request.POST['point_use'])
        request.POST['amount_due'] = reFormatNumber(request.POST['amount_due'])
        request.POST['change'] = reFormatNumber(request.POST['change'])
        request.POST['point_received'] = reFormatNumber(request.POST['point_received'])
        request.POST['payment_method'] = request.POST['payment_method']
        request.POST['payment_reference'] = request.POST['payment_reference']
        request.POST['amount_paid'] = reFormatNumber(request.POST['amount_paid'])
        request.POST['point_to_baht'] = reFormatNumber(request.POST['point_to_baht'])

        form = InvoiceForm(request.POST)
        if form.is_valid():
            invoice = form.save()

            dict_lineitem = json.loads(request.POST['lineitem'])
            for lineitem in dict_lineitem['lineitem']:
                lineitem['invoice_no'] = next_invoice_no
                lineitem['menu_code'] = lineitem['menu_code']
                lineitem['unit_price'] = reFormatNumber(lineitem['unit_price'])
                lineitem['quantity'] = reFormatNumber(lineitem['quantity'])
                lineitem['extended_price'] = reFormatNumber(lineitem['extended_price'])
                lineitem['menu_types'] = lineitem['menu_types']
                lineitem['menu_name'] = lineitem['menu_name']
                # lineitem['point_use'] = reFormatNumber(lineitem['point_use'])
                # lineitem['amount_paid'] = reFormatNumber(lineitem['amount_paid'])

                formlineitem = InvoiceLineItemForm(lineitem)
                # print(formlineitem)
                formlineitem.save()

            data['invoice'] = model_to_dict(invoice)
        else:
            data['error'] = 'form not valid!'

        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response

@method_decorator(csrf_exempt, name='dispatch')
class InvoiceUpdate(View):
    def post(self, request, pk, pk2):
        invoice_no = pk + "/" + pk2
        data = dict()
        invoice = Invoice.objects.get(pk=invoice_no)
        request.POST = request.POST.copy()
        request.POST['invoice_no'] = invoice_no
        request.POST['invoice_date'] = reFormatDateMMDDYYYY(request.POST['invoice_date'])
        request.POST['total'] = reFormatNumber(request.POST['total'])
        request.POST['tax'] = reFormatNumber(request.POST['tax'])
        request.POST['amount_due'] = reFormatNumber(request.POST['amount_due'])
        request.POST['point_use'] = reFormatNumber(request.POST['point_use'])
        request.POST['amount_due'] = reFormatNumber(request.POST['amount_due'])
        request.POST['change'] = reFormatNumber(request.POST['change'])
        request.POST['point_received'] = reFormatNumber(request.POST['point_received'])
        request.POST['payment_method'] = request.POST['payment_method']
        request.POST['payment_reference'] = request.POST['payment_reference']
        request.POST['amount_paid'] = reFormatNumber(request.POST['amount_paid'])

        form = InvoiceForm(instance=invoice, data=request.POST)
        if form.is_valid():
            invoice = form.save()

            InvoiceLineItem.objects.filter(invoice_no=invoice_no).delete()

            dict_lineitem = json.loads(request.POST['lineitem'])
            for lineitem in dict_lineitem['lineitem']:
                lineitem['invoice_no'] = invoice_no
                lineitem['lineitem'] = lineitem['lineitem']
                lineitem['menu_code'] = lineitem['menu_code']
                lineitem['unit_price'] = reFormatNumber(lineitem['unit_price'])
                lineitem['quantity'] = reFormatNumber(lineitem['quantity'])
                lineitem['extended_price'] = reFormatNumber(lineitem['extended_price'])
                lineitem['menu_types'] = lineitem['menu_types']
                lineitem['menu_name'] = lineitem['menu_name']
                # lineitem['point_use'] = reFormatNumber(lineitem['point_use'])
                # lineitem['amount_paid'] = reFormatNumber(lineitem['amount_paid'])
                
                formlineitem = InvoiceLineItemForm(lineitem)
                formlineitem.save()

            data['invoice'] = model_to_dict(invoice)
        else:
            data['error'] = 'form not valid!'

        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response

@method_decorator(csrf_exempt, name='dispatch')
class InvoiceDelete(View):
    def post(self, request, pk, pk2):
        invoice_no = pk + "/" + pk2
        data = dict()
        invoice = Invoice.objects.get(pk=invoice_no)
        if invoice:
            invoice.delete()
            data['message'] = "Invoice Deleted!"
        else:
            data['message'] = "Error!"

        return JsonResponse(data)


class CustomerForm(forms.ModelForm):
    class Meta:
        model = Customer
        fields = '__all__'

@method_decorator(csrf_exempt, name='dispatch')
class update_point(View):
    def post(self, request, pk, pk2):
        club_id = pk
        print(pk)
        print(pk2)
        data = dict()
        customer = Customer.objects.get(pk=club_id)
        # customer = get_object_or_404(Customer, pk=club_id)
        # customer = Customer.objects.filter(club_id=club_id).values()
        print("////////////////////////")
        print(customer)
        print("////////////////////////")

        float(pk2)
        print(pk2)

        points = reFormatNumber(request.POST['point_amount'])

        # round(float(points))

        # pointss = "{:.2f}".format(points)

        print(points)

        request.POST = request.POST.copy()
        request.POST['club_id'] = club_id
        request.POST['point_amount'] = int(float(points)) + int(float(pk2))

        print(request.POST)
        form = CustomerForm(instance=customer, data=request.POST)
        print("////////////////////////")
        print(form)
        print("////////////////////////")
        if form.is_valid():
            customer = form.save()
            if form.is_valid():
                customer = form.save()

                data['customer'] = model_to_dict(customer)
            else:
                data['error'] = 'form not valid!'

        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response


class InvoicePDF(View):
    def get(self, request, pk, pk2):
        invoice_no = pk + "/" + pk2

        invoice = list(Invoice.objects.select_related("customer").filter(invoice_no=invoice_no).values('invoice_no', 'invoice_date', 'club_id','club_id__first_name','total','tax','amount_due','point_use','change','point_received','payment_method','payment_reference','amount_paid','point_to_baht'))
        invoicelineitem = list(InvoiceLineItem.objects.select_related('menu_code').filter(invoice_no=invoice_no).order_by('lineitem').values("lineitem","invoice_no","menu_code","menu_name","menu_types","unit_price","quantity","extended_price"))
        #invoicelineitem = InvoiceLineItem.objects.raw(
        #    "SELECT * "
        #    "FROM invoice_line_item LIT "
        #    "  JOIN product P ON LIT.product_code = P.code "
        #    "WHERE LIT.invoice_no = '{}'" .format(invoice_no)
        #)

        #list_lineitem = [] 
        #for lineitem in invoicelineitem:
        #    dict_lineitem = json.loads(str(lineitem))
        #    dict_lineitem['product_name'] = lineitem.product_code.name
        #    dict_lineitem['units'] = lineitem.product_code.units
        #    list_lineitem.append(dict_lineitem)

        data = dict()
        data['invoice'] = invoice[0]
        data['invoicelineitem'] = invoicelineitem
        
        #return JsonResponse(data)
        return render(request, 'invoice/pdf.html', data)

class InvoiceReport(View):
    def get(self, request):

        with connection.cursor() as cursor:
            cursor.execute('SELECT i.invoice_no as "Invoice No", i.invoice_date as "Invoice Date" '
                           ' , i.club_id as "Club ID", c.first_name as "Customer Name" '
                           ' , i.total as "Total", i.tax as "TAX", i.amount_due as "Amount Due" '
                           ' FROM invoice i LEFT JOIN customer c '
                           ' ON i.club_id = c.club_id '
                           ' ORDER BY i.invoice_no ')
            
            row = dictfetchall(cursor)
            column_name = [col[0] for col in cursor.description]

        data = dict()
        data['column_name'] = column_name
        data['data'] = row
        
        #return JsonResponse(data)
        return render(request, 'invoice/report.html', data)

def dictfetchall(cursor):
    "Return all rows from a cursor as a dict"
    columns = [name[0].replace(" ", "_").lower() for name in cursor.description]
    return [
        dict(zip(columns, row))
        for row in cursor.fetchall()
    ]

def reFormatDateMMDDYYYY(ddmmyyyy):
        if (ddmmyyyy == ''):
            return ''
        return ddmmyyyy[3:5] + "/" + ddmmyyyy[:2] + "/" + ddmmyyyy[6:]

def reFormatNumber(str):
        if (str == ''):
            return ''
        return str.replace(",", "")



