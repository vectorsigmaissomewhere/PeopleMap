from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser, PermissionsMixin
from django.utils.translation import gettext_lazy as _
import random
import string
from datetime import datetime, timedelta
from django.utils import timezone

class UserManager(BaseUserManager):
    def create_user(self, email, name, password=None, **extra_fields):
        if not email:
            raise ValueError(_('The Email must be set'))
        email = self.normalize_email(email)
        
        # Generate verification code
        verification_code = ''.join(random.choices(string.digits, k=6))
        
        user = self.model(
            email=email, 
            name=name, 
            verification_code=verification_code,
            verification_code_expires=timezone.now() + timedelta(hours=24),
            **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, name, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('is_active', True)
        extra_fields.setdefault('is_admin', True)
        extra_fields.setdefault('is_verified', True)  # Superuser is verified by default

        if extra_fields.get('is_staff') is not True:
            raise ValueError(_('Superuser must have is_staff=True.'))
        if extra_fields.get('is_superuser') is not True:
            raise ValueError(_('Superuser must have is_superuser=True.'))
        return self.create_user(email, name, password, **extra_fields)

class User(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(
        verbose_name='Email',
        max_length=255,
        unique=True,
    )
    name = models.CharField(max_length=200)
    is_active = models.BooleanField(default=True)
    is_admin = models.BooleanField(default=False)
    is_staff = models.BooleanField(default=False)
    is_verified = models.BooleanField(default=False)
    
    # Verification fields
    verification_code = models.CharField(max_length=6, blank=True, null=True)
    verification_code_expires = models.DateTimeField(blank=True, null=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['name']

    def __str__(self):
        return self.email
    
    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return True

    @property
    def is_superuser(self):
        return self.is_admin
    
    def generate_new_verification_code(self):
        """Generate a new verification code for the user"""
        from django.utils import timezone
        import random
        import string
        
        self.verification_code = ''.join(random.choices(string.digits, k=6))
        self.verification_code_expires = timezone.now() + timedelta(hours=24)
        self.save()
        return self.verification_code
    
    def is_verification_code_valid(self, code):
        """Check if the verification code is valid and not expired"""
        from django.utils import timezone
        
        if not self.verification_code or not self.verification_code_expires:
            return False
        
        if self.verification_code != code:
            return False
        
        if timezone.now() > self.verification_code_expires:
            return False
        
        return True