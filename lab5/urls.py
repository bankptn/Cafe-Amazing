"""lab5 URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/2.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path

from report import views as report_views
from invoice import views as invoice_views
from receipt import views as receipt_views
from login import views as login_views
from signup import views as signup_views

urlpatterns = [
    path('admin/', admin.site.urls),
    # path('', invoice_views.index, name='index'),
    # path('', receipt_views.index, name='index'),

    path('report', report_views.index, name='index'),
    path('report/ReportListAllInvoices', report_views.ReportListAllInvoices),
    path('report/ReportProductsSold', report_views.ReportProductsSold),
    path('report/ReportListAllProducts', report_views.ReportListAllProducts),
    path('report/ReportListAllReceipts', report_views.ReportListAllReceipts),
    path('report/ReportUnpaidInvoices', report_views.ReportUnpaidInvoices),

    path('invoice', invoice_views.index, name='index'),
    path('product/list', invoice_views.MenuList.as_view(), name='product_list'),
    path('customer/list', invoice_views.CustomerList.as_view(), name='customer_list'),
    path('customer/detail/<pk>', invoice_views.CustomerDetail.as_view(), name='customer_detail'),
    path('invoice/list', invoice_views.InvoiceList.as_view(), name='invoice_list'),
    path('invoice/detail/<str:pk>/<str:pk2>', invoice_views.InvoiceDetail.as_view(), name='invoice_detail'),
    path('invoice/create', invoice_views.InvoiceCreate.as_view(), name='invoice_create'),
    path('invoice/update/<str:pk>/<str:pk2>', invoice_views.InvoiceUpdate.as_view(), name='invoice_update'),
    path('invoice/delete/<str:pk>/<str:pk2>', invoice_views.InvoiceDelete.as_view(), name='invoice_delete'),
    path('invoice/pdf/<str:pk>/<str:pk2>', invoice_views.InvoicePDF.as_view(), name='invoice_pdf'),
    path('invoice/report', invoice_views.InvoiceReport.as_view(), name='invoice_report'),

    path('payment/list', invoice_views.PaymentList.as_view(), name='payment_list'),
    path('payment/detail/<pk>', invoice_views.PaymentDetail.as_view(), name='payment_detail'),

    path('customer/list', invoice_views.CustomerList.as_view(), name='customer_list'),
    path('customer/detail/<pk>', invoice_views.CustomerDetail.as_view(), name='customer_detail'),

    path('receipt', receipt_views.index, name='index'),
    path('invoice/list', receipt_views.InvoiceList.as_view(), name='invoice_list'),

    path('employee/list', receipt_views.EmployeeList.as_view(), name='employee_list'),
    path('employee/detail/<pk>', receipt_views.EmployeeDetail.as_view(), name='employee_detail'),

    path('update/point/<str:pk>/<str:pk2>', invoice_views.update_point.as_view(), name='update_point'),
    
    path('', login_views.index, name="login"),
    path('signin/', login_views.login.as_view(), name="check"),

    # path('logout/', login_views.login.as_view(), name="check"),
    # path('signout/', login_views.login.as_view(), name="check"),

    path('sign-up/', signup_views.index, name='index'),
    path('sign-up/create', signup_views.create.as_view(), name='invoice_create'),

    path('receipt/list', receipt_views.ReceiptList.as_view(), name='receipt_list'),
    path('receipt/detail/<str:pk>/<str:pk2>', receipt_views.ReceiptDetail.as_view(), name='receipt_detail'),
    path('receipt/create', receipt_views.ReceiptCreate.as_view(), name='receipt_create'),
    path('receipt/update/<str:pk>/<str:pk2>', receipt_views.ReceiptUpdate.as_view(), name='receipt_update'),
    path('receipt/delete/<str:pk>/<str:pk2>', receipt_views.ReceiptDelete.as_view(), name='receipt_delete'),
    path('receipt/pdf/<str:pk>/<str:pk2>', receipt_views.ReceiptPDF.as_view(), name='receipt_pdf'),
    path('receipt/report', receipt_views.ReceiptReport.as_view(), name='receipt_report'),
]
