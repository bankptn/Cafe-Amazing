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
from receipt.models import *
import json

# Create your views here.
def index(request):
    data = {}
    return render(request, 'receipt/receipt.html', data)

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

class EmployeeList(View):
    def get(self, request):
        employees = list(Employee.objects.all().values())
        data = dict()
        data['employees'] = employees
        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response

class EmployeeDetail(View):
    def get(self, request, pk):
        employee = get_object_or_404(Employee, pk=pk)
        data = dict()
        data['employees'] = model_to_dict(employee)
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

        invoice = list(Invoice.objects.select_related("customer").filter(invoice_no=invoice_no).values('invoice_no', 'invoice_date', 'club_id', 'user_id','total','tax','amount_due'))
        invoicelineitem = list(InvoiceLineItem.objects.select_related('menu_code').filter(invoice_no=invoice_no).order_by('lineitem').values("lineitem","invoice_no","menu_code","menu_code__name","menu_code__types","menu_code__price","unit_price","quantity","extended_price"))

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

class ReceiptList(View):
    def get(self, request):
        receipts = list(Receipt.objects.order_by('receipt_no').all().values())
        data = dict()
        data['receipts'] = receipts
        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response

class ReceiptDetail(View):
    def get(self, request, pk, pk2):
        receipt_no = pk + "/" + pk2  

        receipt = list(Receipt.objects.select_related("customer").filter(receipt_no=receipt_no).values('receipt_no', 'receipt_date', 'club_id', 'club_id__first_name','payment_method','payment_reference','remarks','total_received'))
        receiptlineitem = list(ReceiptLineItem.objects.select_related('invoice_no').filter(receipt_no=receipt_no).order_by('lineitem').values("lineitem","invoice_no","invoice_no__invoice_date","invoice_no__amount_due","amount_paid","change","point"))

        data = dict()
        data['receipt'] = receipt[0]
        data['receiptlineitem'] = receiptlineitem

        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response

class ReceiptForm(forms.ModelForm):
    class Meta:
        model = Receipt
        fields = '__all__'

class ReceiptLineItemForm(forms.ModelForm):
    class Meta:
        model = ReceiptLineItem
        fields = '__all__'

@method_decorator(csrf_exempt, name='dispatch')
class ReceiptCreate(View):
    def post(self, request):
        data = dict()
        request.POST = request.POST.copy()
        if Receipt.objects.count() != 0:
            receipt_no_max = Receipt.objects.aggregate(Max('receipt_no'))['receipt_no__max']
            next_receipt_no = receipt_no_max[0:3] + str(int(receipt_no_max[3:7])+1) + "/" + receipt_no_max[8:10]
        else:
            next_receipt_no = "RCT1001/20"
        request.POST['receipt_no'] = next_receipt_no
        request.POST['receipt_date'] = reFormatDateMMDDYYYY(request.POST['date'])
        request.POST['total_received'] = reFormatNumber(request.POST['total_received'])

        form = ReceiptForm(request.POST)
        if form.is_valid():
            receipt = form.save()

            dict_lineitem = json.loads(request.POST['lineitem'])
            for lineitem in dict_lineitem['lineitem']:
                lineitem['receipt_no'] = next_receipt_no
                lineitem['amount_paid'] = reFormatNumber(lineitem['amount_paid'])
                formlineitem = ReceiptLineItemForm(lineitem)
                formlineitem.save()

            data['receipt'] = model_to_dict(receipt)
        else:
            data['error'] = 'form not valid!'

        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response

@method_decorator(csrf_exempt, name='dispatch')
class ReceiptUpdate(View):
    def post(self, request, pk, pk2):
        receipt_no = pk + "/" + pk2
        data = dict()
        receipt = Receipt.objects.get(pk=receipt_no)
        request.POST = request.POST.copy()
        request.POST['receipt_no'] = receipt_no
        request.POST['receipt_date'] = reFormatDateMMDDYYYY(request.POST['date'])
        request.POST['total_received'] = reFormatNumber(request.POST['total_received'])

        form = ReceiptForm(instance=receipt, data=request.POST)
        if form.is_valid():
            receipt = form.save()

            ReceiptLineItem.objects.filter(receipt_no=receipt_no).delete()

            dict_lineitem = json.loads(request.POST['lineitem'])
            for lineitem in dict_lineitem['lineitem']:
                lineitem['receipt_no'] = receipt_no
                lineitem['lineitem'] = lineitem['lineitem']
                lineitem['invoice_no'] = lineitem['invoice_no']
                lineitem['amount_paid'] = reFormatNumber(lineitem['amount_paid'])
                formlineitem = ReceiptLineItemForm(lineitem)
                formlineitem.save()

            data['receipt'] = model_to_dict(receipt)
        else:
            data['error'] = 'form not valid!'

        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response

@method_decorator(csrf_exempt, name='dispatch')
class ReceiptDelete(View):
    def post(self, request, pk, pk2):
        receipt_no = pk + "/" + pk2
        data = dict()
        receipt = Receipt.objects.get(pk=receipt_no)
        if receipt:
            receipt.delete()
            data['message'] = "Receipt Deleted!"
        else:
            data['message'] = "Error!"

        return JsonResponse(data)

class ReceiptPDF(View):
    def get(self, request, pk, pk2):
        receipt_no = pk + "/" + pk2

        receipt = list(Receipt.objects.select_related("customer").filter(receipt_no=receipt_no).values('receipt_no', 'receipt_date', 'club_id', 'club_id__first_name','payment_method','payment_reference','remarks','total_received'))
        receiptlineitem = list(ReceiptLineItem.objects.select_related('invoice_no').filter(receipt_no=receipt_no).order_by('lineitem').values("lineitem","invoice_no","invoice_no__invoice_date","invoice_no__amount_due","amount_paid","change","point"))
        
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
        data['receipt'] = receipt[0]
        data['receiptlineitem'] = receiptlineitem
        
        #return JsonResponse(data)
        return render(request, 'receipt/pdf.html', data)

class ReceiptReport(View):
    def get(self, request):

        with connection.cursor() as cursor:
            cursor.execute('SELECT r.receipt_no as "Receipt No", r.receipt_date as "Receipt Date" '
                           ' , r.club_id as "Club ID", c.first_name as "Customer Name" '
                           ' , r.payment_method as "Payment Method" '
                           ' , r.payment_reference as "Payment Reference", r.remarks as "Remarks" '
                           ' , r.total_received as "Total Received" '
                           ' FROM receipt r LEFT JOIN customer c '
                           ' ON r.club_id = c.club_id '
                           ' ORDER BY r.receipt_no ')
            
            row = dictfetchall(cursor)
            column_name = [col[0] for col in cursor.description]

        data = dict()
        data['column_name'] = column_name
        data['data'] = row
        
        #return JsonResponse(data)
        return render(request, 'receipt/report.html', data)

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