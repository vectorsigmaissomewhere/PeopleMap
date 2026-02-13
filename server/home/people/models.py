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

    class Meta:
        unique_together = ['user', 'name']

class People(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL, 
        on_delete=models.CASCADE,
        related_name='people' 
    )
    people_id = models.BigAutoField(primary_key=True)

    # Required fields (cannot be null)
    name = models.CharField(max_length=255)  
    notes = models.TextField() 
    
    # Optional fields
    email = models.CharField(max_length=255, null=True, blank=True)
    phone = models.CharField(max_length=255, null=True, blank=True)
    company = models.CharField(max_length=255, null=True, blank=True)
    role = models.CharField(max_length=255, null=True, blank=True)
    department = models.CharField(max_length=255, null=True, blank=True)
    street = models.CharField(max_length=255, null=True, blank=True)
    city = models.CharField(max_length=255, null=True, blank=True)
    state = models.CharField(max_length=255, null=True, blank=True)
    zip = models.CharField(max_length=255, null=True, blank=True)
    country = models.CharField(max_length=255, null=True, blank=True)
    image = models.CharField(max_length=255, null=True, blank=True)
    
    tag = models.ForeignKey(
        Tags, 
        on_delete=models.SET_NULL, 
        related_name='people',
        null=True, 
    )
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    class Meta:
        verbose_name_plural = "People"
        unique_together = ['user', 'email']  
    
    def __str__(self):
        return self.name