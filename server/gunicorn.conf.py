import sys
import os

# Get the server directory
server_dir = os.path.dirname(os.path.abspath(__file__))

# Add paths to Python path
if server_dir not in sys.path:
    sys.path.insert(0, server_dir)

# Add the nested home path
nested_home = os.path.join(server_dir, 'home', 'home')
if os.path.exists(nested_home) and nested_home not in sys.path:
    sys.path.insert(0, nested_home)

# Set the WSGI app to the nested location
wsgi_app = "home.home.wsgi:application"

# Optional: Add logging to see what's happening
print(f"Server directory: {server_dir}")
print(f"Nested home: {nested_home}")
print(f"Python path: {sys.path}")