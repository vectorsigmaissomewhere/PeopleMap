# server/gunicorn.conf.py
import sys
import os

print("=" * 50)
print("GUNICORN CONFIG LOADED")
print("=" * 50)

# Get paths
server_dir = os.path.dirname(os.path.abspath(__file__))
home_dir = os.path.join(server_dir, 'home')
nested_home = os.path.join(home_dir, 'home')

# Add paths to Python path
for path in [nested_home, home_dir, server_dir]:
    if path not in sys.path:
        sys.path.insert(0, path)
        print(f"✅ Added {path} to Python path")

# CRITICAL: Set the Django settings module
os.environ['DJANGO_SETTINGS_MODULE'] = 'home.home.settings'
print(f"✅ Set DJANGO_SETTINGS_MODULE to {os.environ['DJANGO_SETTINGS_MODULE']}")

print(f"Python path: {sys.path}")

# Set the WSGI app
wsgi_app = "home.home.wsgi:application"

print(f"wsgi_app set to: {wsgi_app}")
print("=" * 50)