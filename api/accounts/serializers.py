from rest_framework import serializers
from accounts.models import User
from rest_framework.exceptions import ValidationError
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from datetime import timedelta
# from utils import Util

# sending email 
from django.core.mail import BadHeaderError, EmailMessage
from django.http import HttpResponse
from django.conf import settings

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(style={'input_type':'password'}, write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'name', 'password']
        extra_kwargs = {
            'password': {'write_only': True}
        }
    
    def validate(self, attrs):
        password = attrs.get('password')
        if len(password) < 8:
            raise serializers.ValidationError("Password must be at least 8 characters long")
        return attrs
    
    def create(self, validated_data):
        # Create user (verification code is generated in UserManager.create_user)
        user = User.objects.create_user(
            email=validated_data['email'],
            name=validated_data['name'],
            password=validated_data['password'],
            is_active=False  # User not active until verified
        )
        
        # Send verification email
        from accounts.utils import Util
        Util.send_verification_email(
            user_email=user.email,
            verification_code=user.verification_code,
            user_name=user.name
        )
        
        return user


class ResendVerificationEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    
    class Meta:
        fields = ['email']
    
    def validate(self, attrs):
        email = attrs.get('email')
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
        
        # Check if user is already verified
        if user.is_verified:
            raise serializers.ValidationError("Email is already verified")
        
        # Store user in context for use in save method
        self.context['user'] = user
        return attrs
    
    def save(self, **kwargs):
        """Generate new verification code and send email"""
        user = self.context.get('user')
        
        # Generate new verification code
        new_code = user.generate_new_verification_code()
        
        # Send verification email
        from accounts.utils import Util
        Util.send_verification_email(
            user_email=user.email,
            verification_code=new_code,
            user_name=user.name
        )
        
        return user

class UserLoginSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(max_length=255)
    class Meta:
        model = User
        fields = ['email', 'password']

class UserChangePasswordSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
    password2 = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)  # ADD THIS
    
    class Meta:
        fields = ['password', 'password2']
    
    def validate(self, attrs):
        password = attrs.get('password')
        password2 = attrs.get('password2')
        user = self.context.get('user')
        
        if password != password2:
            raise serializers.ValidationError("Password and Confirm Password doesn't match")
        
        user.set_password(password)
        user.save()
        return attrs

# send email to user
class SendPasswordResetEmailSerializer(serializers.Serializer):
    email = serializers.EmailField(max_length=255)
    
    class Meta:
        fields = ['email']
    
    def validate(self, attrs):
        email = attrs.get('email')
        
        # Check if the email exists in the User model
        if not User.objects.filter(email=email).exists():
            raise serializers.ValidationError("You are not a registered user.")
        
        # Store user in context for use in view
        user = User.objects.get(email=email)
        self.context['user'] = user
        
        return attrs
    
class UserPasswordResetSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
    password2 = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
    
    class Meta:
        fields = ['password', 'password2']
    
    def validate(self, attrs):
        try:
            password = attrs.get('password')
            password2 = attrs.get('password2')
            uid = self.context.get('uid')
            token = self.context.get('token')
            
            if password != password2:
                raise serializers.ValidationError({"password": "Password and Confirm Password don't match"})
            
            if len(password) < 8:
                raise serializers.ValidationError({"password": "Password must be at least 8 characters long"})
            
            id = smart_str(urlsafe_base64_decode(uid))
            user = User.objects.get(id=id)
            
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise ValidationError({'token': 'Token is not valid or has expired'})
            
            user.set_password(password)
            user.save()
            
            return attrs
            
        except DjangoUnicodeDecodeError:
            raise ValidationError({'token': 'Token is not valid or has expired'})
        except User.DoesNotExist:
            raise ValidationError({'uid': 'User not found'})
        

class VerifyEmailSerializer(serializers.Serializer):
    email = serializers.EmailField()
    verification_code = serializers.CharField(max_length=6)
    
    class Meta:
        fields = ['email', 'verification_code']
    
    def validate(self, attrs):
        email = attrs.get('email')
        verification_code = attrs.get('verification_code')
        
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            raise serializers.ValidationError("User not found")
        
        # Check if user is already verified
        if user.is_verified:
            raise serializers.ValidationError("Email is already verified")
        
        # Validate the verification code
        if not user.is_verification_code_valid(verification_code):
            raise serializers.ValidationError("Invalid or expired verification code")
        
        # Store user in context for use in save method
        self.context['user'] = user
        return attrs
    
    def save(self, **kwargs):
        """Mark user as verified"""
        user = self.context.get('user')
        user.is_verified = True
        user.is_active = True  # Activate the user
        user.verification_code = None  # Clear the verification code
        user.verification_code_expires = None
        user.save()
        return user
    

class UserUpdateSerializer(serializers.Serializer):
    email = serializers.EmailField(required=False)
    name = serializers.CharField(max_length=200, required=False)
    
    class Meta:
        fields = ['email', 'name']
    
    def validate_email(self, value):
        user = self.context.get('user')
        
        # Check if email is being changed
        if value and value != user.email:
            # Check if email already exists
            if User.objects.filter(email=value).exclude(id=user.id).exists():
                raise serializers.ValidationError("Email already exists")
        return value
    
    def validate(self, attrs):
        user = self.context.get('user')
        return attrs
    
    def save(self, **kwargs):
        user = self.context.get('user')
        
        if 'email' in self.validated_data and self.validated_data['email'] != user.email:
            user.email = self.validated_data['email']
            # If email changes, require re-verification
            user.is_verified = False
            # Generate new verification code
            from django.utils import timezone
            import random
            import string
            user.verification_code = ''.join(random.choices(string.digits, k=6))
            user.verification_code_expires = timezone.now() + timedelta(hours=24)
            
            # Send verification email
            from accounts.utils import Util
            Util.send_verification_email(
                user_email=user.email,
                verification_code=user.verification_code,
                user_name=user.name
            )
        
        if 'name' in self.validated_data:
            user.name = self.validated_data['name']
        
        user.save()
        return user