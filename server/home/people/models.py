from django.db import models
from django.conf import settings 
from accounts.models import User 


class Tags(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='tags'
    )
    tags_id = models.BigAutoField(primary_key=True)
    name = models.CharField(max_length=255)
    colorname = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)  
    updated_at = models.DateTimeField(auto_now=True)  