from django.core.mail import EmailMessage
from django.conf import settings

class Util:
    @staticmethod
    def send_verification_email(user_email, verification_code, user_name=""):
        subject = "Verify Your Email Address"
        
        html_message = f"""
        <html>
        <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f4f4f4;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
                <h2 style="color: #333; text-align: center;">Email Verification</h2>
                <p style="color: #666; font-size: 16px;">Hello {user_name},</p>
                <p style="color: #666; font-size: 16px;">Thank you for registering! Please use the verification code below to verify your email address:</p>
                
                <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; text-align: center; margin: 25px 0; border: 2px dashed #007bff;">
                    <div style="font-size: 32px; font-weight: bold; color: #007bff; letter-spacing: 8px;">
                        {verification_code}
                    </div>
                </div>
                
                <p style="color: #666; font-size: 14px; text-align: center;">
                    This code will expire in 24 hours.
                </p>
                
                <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; text-align: center;">
                    <p style="color: #999; font-size: 12px;">
                        If you didn't create an account, you can safely ignore this email.
                    </p>
                </div>
            </div>
        </body>
        </html>
        """
        
        plain_message = f"""
        Email Verification
        
        Hello {user_name},
        
        Thank you for registering! Please use the verification code below to verify your email address:
        
        Verification Code: {verification_code}
        
        This code will expire in 24 hours.
        
        If you didn't create an account, you can safely ignore this email.
        """
        
        email = EmailMessage(
            subject=subject,
            body=html_message,
            from_email=settings.EMAIL_HOST_USER,
            to=[user_email],
        )
        email.content_subtype = "html"
        email.send(fail_silently=False)