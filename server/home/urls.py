from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/user/', include('server.home.accounts.urls')),
    path('api/people/', include('server.home.people.urls')),
]
