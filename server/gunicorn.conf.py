import sys
import os

print("=" * 50)
print("GUNICORN CONFIG LOADED")
print("=" * 50)

# Get paths
server_dir = os.path.dirname(os.path.abspath(__file__))

# Don't modify path here - let the wrapper handle it
# Just set the WSGI app to our wrapper
wsgi_app = "wsgi:application"  # Points to server/wsgi.py

print(f"wsgi_app set to: {wsgi_app}")
print(f"Server directory: {server_dir}")
print("=" * 50)