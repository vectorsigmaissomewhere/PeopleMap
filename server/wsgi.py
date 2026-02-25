# server/wsgi.py
import os
import sys
from pathlib import Path

# Add paths in correct order
current_dir = os.path.dirname(os.path.abspath(__file__))
home_dir = os.path.join(current_dir, 'home')
nested_home = os.path.join(home_dir, 'home')

# Add paths to sys.path (parent first, then child)
for path in [current_dir, home_dir, nested_home]:
    if path not in sys.path:
        sys.path.insert(0, path)
        print(f"WSGI wrapper: Added {path} to sys.path")

# Set the settings module
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'home.home.settings')

# Import Django and get application
try:
    from django.core.wsgi import get_wsgi_application
    application = get_wsgi_application()
    print("✅ Successfully loaded Django application")
except Exception as e:
    print(f"❌ Failed to load Django application: {e}")
    raise