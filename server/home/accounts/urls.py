from django.urls import path, include
from . import views
from accounts.views import UserRegistrationView, UserLoginView,UserChangePasswordView, SendPasswordResetEmailView, UserPasswordResetView, VerifyEmailView, CheckAuthView, LogoutView, ResendVerificationEmailView

urlpatterns = [
    path('register/',UserRegistrationView.as_view(), name='register'),
    path('login/', UserLoginView.as_view(), name='login'),
    path('changepassword/', UserChangePasswordView.as_view(), name='changepassword'),
    path('send-reset-password-email/', SendPasswordResetEmailView.as_view(), name='send-reset-password-email'),
    path('resend-verification-email/', ResendVerificationEmailView.as_view(), name='resend-verification-email'),
    path('reset-password/<uid>/<token>/', UserPasswordResetView.as_view(), name='reset-password'),
    path('verify-email/', VerifyEmailView.as_view(), name='verify-email'),
    path('check-auth/', CheckAuthView.as_view(), name='check-auth'),
    path('logout/', LogoutView.as_view(), name='logout'),
]