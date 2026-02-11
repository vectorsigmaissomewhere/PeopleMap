from rest_framework import serializers
from accounts.models import User
from rest_framework.exceptions import ValidationError
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
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
        
        if User.objects.filter(email=email).exists():
            user = User.objects.get(email=email)
            
            # Generate the encoded user ID and password reset token
            uid = urlsafe_base64_encode(force_bytes(user.id))  # Encodes the user ID
            token = PasswordResetTokenGenerator().make_token(user)  # Generates a reset token
            
            # Generate the reset password link
            link = f'http://localhost:8000/api/user/reset-password/{uid}/{token}'
            
            # Preparing the email content
            subject = "Reset Password Link"
            message = link
            from_email = settings.EMAIL_HOST_USER  # Email from settings
            to_email = 'anishbroo501625@gmail.com'  # Sending the email to the user

            try:
                # Create and send the email
                email = EmailMessage(
                    subject,
                    message,
                    from_email,
                    [to_email],  # Send to user's email
                )
                email.send(fail_silently=False)
            except BadHeaderError:
                return HttpResponse("Invalid header found.")
            
            return HttpResponse("Password reset email sent successfully.")
        
        else:
            raise serializers.ValidationError("You are not a registered user.")
        
        return attrs
    
# Creating serializer for UserPasswordResetSerializer
class UserPasswordResetSerializer(serializers.Serializer):
    password = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
    password2 = serializers.CharField(max_length=255, style={'input_type':'password'}, write_only=True)
    class Meta:
        fields = ['password','password2']
    
    def validate(self,attrs):
        try:
            password = attrs.get('password')
            password2 = attrs.get('password2')
            uid = self.context.get('uid')
            token = self.context.get('token')
            if password != password2:
                raise serializers.ValidationError("Password and Confirm Password doesn't match")
            id = smart_str(urlsafe_base64_decode(uid)) # smart_str converts into string
            user = User.objects.get(id=id)
            if not PasswordResetTokenGenerator().check_token(user, token):
                raise ValidationError('Token is not Valid or Expired')
            user.set_password(password)
            user.save()
            return attrs
        except DjangoUnicodeDecodeError as identifier:
            raise ValidationError('Token is not Valid or Expired')
        

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