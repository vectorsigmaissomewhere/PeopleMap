from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from accounts.serializers import UserRegistrationSerializer, UserLoginSerializer, UserChangePasswordSerializer, SendPasswordResetEmailSerializer, UserPasswordResetSerializer, VerifyEmailSerializer, ResendVerificationEmailSerializer
from django.contrib.auth import authenticate
from accounts.renderers import UserRenderer
from rest_framework_simplejwt.tokens import RefreshToken 
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import viewsets
from .models import User 
from django.utils.encoding import force_bytes
from django.utils.http import urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.core.mail import EmailMessage, BadHeaderError
from django.conf import settings

def get_token_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'refresh': str(refresh),
        'access': str(refresh.access_token),
    }

class UserRegistrationView(APIView):
    renderer_classes = [UserRenderer] # will show the error that your have provided
    def post(self, request, format=None):
        serializer = UserRegistrationSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            token = get_token_for_user(user)
            return Response({'token':token, 'msg':'Registration Successful'},status=status.HTTP_201_CREATED)
        print(serializer.errors)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class UserLoginView(APIView):
    renderer_classes = [UserRenderer]
    
    def post(self, request, format=None):
        serializer = UserLoginSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            email = serializer.data.get('email')
            password = serializer.data.get('password')
            user = authenticate(email=email, password=password)
            
            if user is not None:
                if not user.is_verified:
                    # Check if verification code has expired
                    from django.utils import timezone
                    if user.verification_code_expires and timezone.now() > user.verification_code_expires:
                        # Generate new code
                        new_code = user.generate_new_verification_code()
                        
                        # Send new verification email
                        from accounts.utils import Util
                        Util.send_verification_email(
                            user_email=user.email,
                            verification_code=new_code,
                            user_name=user.name
                        )
                    
                    return Response({
                        'error': 'Email not verified. Please check your email for verification code.',
                        'verified': False,
                        'email': user.email,
                        'resend_available': True
                    }, status=status.HTTP_403_FORBIDDEN)
                
                token = get_token_for_user(user)
                return Response({
                    'token': token, 
                    'msg': 'Login Success',
                    'verified': True,
                    'user': {
                        'email': user.email,
                        'name': user.name
                    }
                }, status=status.HTTP_200_OK)
            else:
                return Response({
                    'errors': {'non_field_errors': ['Email or Password is not Valid']}
                }, status=status.HTTP_404_NOT_FOUND)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserChangePasswordView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [IsAuthenticated]
    def post(self,request, format=None):
        serializer = UserChangePasswordSerializer(data=request.data,context={'user':request.user})
        if serializer.is_valid(raise_exception=True):
            return Response({'msg':'Password Changed Successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

        
# send email to user for password change
class SendPasswordResetEmailView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [] 
    authentication_classes = []

    def post(self, request, format=None):
        serializer = SendPasswordResetEmailSerializer(data=request.data, context={'request': request})
        
        if serializer.is_valid(raise_exception=True):
            email = serializer.validated_data.get('email')
            user = User.objects.get(email=email)
            
            # Generate the encoded user ID and password reset token
            uid = urlsafe_base64_encode(force_bytes(user.id))
            token = PasswordResetTokenGenerator().make_token(user)
            
            # Generate the reset password link - USE FRONTEND URL, NOT BACKEND
            link = f'http://localhost:5173/auth/reset-password/{uid}/{token}/'
            
            # Send email
            subject = "Reset Your Password - Family Tree"
            message = f"""
Hello {user.name},

You requested to reset your password. Click the link below to reset it:

{link}

If you didn't request this, please ignore this email.

This link will expire in 24 hours.

Thanks,
Family Tree Team
"""
            from_email = settings.EMAIL_HOST_USER
            to_email = email
            
            try:
                email_msg = EmailMessage(
                    subject,
                    message,
                    from_email,
                    [to_email],
                )
                email_msg.send(fail_silently=False)
                
                return Response({
                    'msg': 'Password reset link has been sent to your email.',
                    'success': True
                }, status=status.HTTP_200_OK)
                
            except BadHeaderError:
                return Response({
                    'msg': 'Email sending failed',
                    'success': False
                }, status=status.HTTP_400_BAD_REQUEST)
            except Exception as e:
                print(f"Email error: {e}")
                return Response({
                    'msg': 'Failed to send email. Please try again.',
                    'success': False
                }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# update the password now
class UserPasswordResetView(APIView):
    renderer_classes = [UserRenderer]
    def post(self, request, uid, token, format=None):
        serializer = UserPasswordResetSerializer(data=request.data, context={'uid':uid, 'token': token})
        if serializer.is_valid(raise_exception=True):
            return Response({'msg':'Password Reset Successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VerifyEmailView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [] 
    authentication_classes = []
    
    def post(self, request, format=None):
        serializer = VerifyEmailSerializer(data=request.data)
        
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            
            # Generate token for immediate login after verification
            token = get_token_for_user(user)
            
            return Response({
                'msg': 'Email verified successfully',
                'token': token,
                'verified': True,
                'user': {
                    'email': user.email,
                    'name': user.name
                }
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class ResendVerificationEmailView(APIView):
    renderer_classes = [UserRenderer]
    permission_classes = [AllowAny]

    def post(self, request, format=None):
        serializer = ResendVerificationEmailSerializer(data=request.data)
        
        if serializer.is_valid(raise_exception=True):
            user = serializer.save()
            
            return Response({
                'msg': 'Verification email sent successfully',
                'email': user.email,
                'resend': True
            }, status=status.HTTP_200_OK)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class CheckAuthView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        return Response({
            "success": True,
            "user": {
                "id": user.id,
                "email": user.email,
                "name": user.name
            }
        }, status=status.HTTP_200_OK)

class LogoutView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"success": True})
        except Exception:
            return Response({"success": False}, status=400)