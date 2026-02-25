# server/home/home/wsgi.py
import os
import sys
import traceback

# Print debug info (this will show in Render logs)
print("=" * 50)
print("WSGI.PY IS LOADING")
print("=" * 50)
print(f"Current directory: {os.getcwd()}")
print(f"Python path: {sys.path}")
print(f"DJANGO_SETTINGS_MODULE: {os.environ.get('DJANGO_SETTINGS_MODULE')}")

try:
    from django.core.wsgi import get_wsgi_application
    
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'home.home.settings')
    print("✅ Set DJANGO_SETTINGS_MODULE to home.home.settings")
    
    # Try to import settings to catch errors early
    print("Attempting to import settings...")
    from django.conf import settings
    print(f"✅ Settings module found: {settings.SETTINGS_MODULE}")
    print(f"✅ INSTALLED_APPS: {settings.INSTALLED_APPS}")
    print(f"✅ AUTH_USER_MODEL: {settings.AUTH_USER_MODEL}")
    
    application = get_wsgi_application()
    print("✅ WSGI application created successfully!")
    
except Exception as e:
    print("❌ ERROR LOADING DJANGO APPLICATION:")
    print(f"Error type: {type(e).__name__}")
    print(f"Error message: {str(e)}")
    print("\nFull traceback:")
    traceback.print_exc(file=sys.stdout)
    print("=" * 50)
    raise  # Re-raise to ensure Gunicorn sees the failure

print("=" * 50)