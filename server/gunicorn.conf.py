# server/gunicorn.conf.py
import sys
import os

# Get the server directory
server_dir = os.path.dirname(os.path.abspath(__file__))

# Add the path to the inner home folder
inner_home_path = os.path.join(server_dir, 'home')
sys.path.insert(0, server_dir)
sys.path.insert(0, inner_home_path)

print(f"Server dir: {server_dir}")
print(f"Inner home: {inner_home_path}")
print(f"Python path: {sys.path}")

# Point to the correct wsgi location
wsgi_app = "home.home.wsgi:application" 