from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

def ping(request):
    return JsonResponse({"status": "ok", "message": "API base is working yyay"})

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/', include('accounts.urls')),
    path('api/people/', include('people.urls')),
    path('ping/', ping),
]