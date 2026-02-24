import sys
import os

# Add the server directory to the Python path
server_dir = os.path.dirname(os.path.abspath(__file__))
sys.path.append(server_dir)

# The WSGI application module
wsgi_app = "home.wsgi:application"