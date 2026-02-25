# server/home/home/wsgi.py
import os
import sys
from django.core.wsgi import get_wsgi_application

# Add the paths to Python path
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)  # This is /server/home
server_dir = os.path.dirname(parent_dir)   # This is /server

# Add to Python path
sys.path.insert(0, server_dir)
sys.path.insert(0, parent_dir)
sys.path.insert(0, current_dir)

# Set settings module to the nested location
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'home.home.settings')

application = get_wsgi_application()