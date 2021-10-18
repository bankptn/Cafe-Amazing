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
from signup.models import *
import json

# Create your views here.
def index(request):
    data = {}
    return render(request, 'signup.html', data)

class CustomerForm(forms.ModelForm):
    class Meta:
        model = Customer
        fields = '__all__'

@method_decorator(csrf_exempt, name='dispatch')
class create(View):
    def post(self,request):
        data = dict()
        request.POST = request.POST.copy()
        print(request.POST)
        if Customer.objects.count() != 0:
            club_id_max = Customer.objects.aggregate(Max('club_id'))['club_id__max']
            next_club_id = "0" * (4-len(str(int(club_id_max) + 1))) + str(int(club_id_max) + 1)
            print(next_club_id)
        else:
            next_club_id = "0000"
        request.POST['club_id'] = next_club_id
        request.POST['bday'] = reFormatDateMMDDYYYY(request.POST['bday'])
        print(request.POST,"88888")
        form = CustomerForm(request.POST)
        if form.is_valid():
            signup = form.save()

            data['signup'] = model_to_dict(signup)
        
        else:
            print(form.errors)
            data['error'] = 'form not valid!'

        response = JsonResponse(data)
        response["Access-Control-Allow-Origin"] = "*"
        return response

def reFormatDateMMDDYYYY(ddmmyyyy):
        if (ddmmyyyy == ''):
            return ''
        return ddmmyyyy[3:5] + "/" + ddmmyyyy[:2] + "/" + ddmmyyyy[6:]

