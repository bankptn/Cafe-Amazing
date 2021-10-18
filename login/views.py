from django.shortcuts import render, redirect
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
from django.contrib.auth.models import User,auth
from django.contrib.auth import (
    authenticate,
    get_user_model,
    login,
    logout
)
from login.models import *
import json

# Create your views here.
def index(request):
    data = {}
    return render(request, 'login.html', data)

@method_decorator(csrf_exempt, name='dispatch')
class login(View):
    def post(self, request):
        data = dict()
        request.POST = request.POST.copy()
        user_id = request.POST.get('user_id', False)
        password = request.POST["password"]
        result = Employee.objects.filter(user_id=user_id)
        if len(result) == 1:
            if result[0].password == password:
                data['logs'] = {
                    "result": "",
                    "status": "1",
                    "msg": ""
                } 
                response = JsonResponse(data)
                response["Access-Control-Allow-Origin"] = "*"
                return response
            else: 
                data['logs'] = {
                    "result": "",
                    "status": "0",
                    "msg": "Wrong password!"
                } 
                response = JsonResponse(data)
                response["Access-Control-Allow-Origin"] = "*"
                return response
        else:
            data['logs'] = {
                "result": "",
                "status": "0",
                "msg": "User not found!"
            } 
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

class logout(View):
    def get(request):
        data = {}
        return response


# def login(request):
#     # if request.user.is_authenticated:
#     #     return redirect('cus-home')
#     next = request.GET.get('next')
#     print(request.GET)
#     form = UserLoginForm(request.POST or None)
#     if form.is_valid():
#         username = request.POST['username']
#         password = request.POST['password']
#         user = authenticate(request, username=username, password=password)
#         login(request, user)
#         if next:
#             return redirect(next)
#         return redirect('home-cus')

#     context = {
#         'form' : form,
#     }

#     return render(request, "login.html", context)
# #     # if user is not None:
# #     #     login(request, user)
# #     #     return redirect('/cus-home/')
# #     # else:
# #     #     messages.info(request, 'ไม่พบข้อมูล')
# #     #     return redirect('/login/')


