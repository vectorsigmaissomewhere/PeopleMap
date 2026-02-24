# debug.py
import os
import sys

print("=" * 50)
print("DEBUGGING YOUR FOLDER STRUCTURE")
print("=" * 50)

# Current directory
current_dir = os.getcwd()
print(f"Current directory: {current_dir}")

# List files in current directory
print(f"\nFiles in {current_dir}:")
for item in os.listdir('.'):
    print(f"  - {item}")

# Check home folder
if os.path.exists('home'):
    print(f"\n✅ Found 'home' folder")
    print(f"Contents of 'home' folder:")
    for item in os.listdir('home'):
        print(f"  - {item}")
        
        # If there's another home folder inside
        if item == 'home' and os.path.isdir(f'home/{item}'):
            print(f"    ⚠️ Nested 'home' folder found!")
            print(f"    Contents of 'home/home':")
            for subitem in os.listdir(f'home/{item}'):
                print(f"      - {subitem}")
else:
    print(f"\n❌ No 'home' folder found!")

# Check where manage.py is
print(f"\nLooking for manage.py:")
if os.path.exists('manage.py'):
    print(f"✅ manage.py found in current directory")
elif os.path.exists('home/manage.py'):
    print(f"✅ manage.py found in home/")
elif os.path.exists('home/home/manage.py'):
    print(f"✅ manage.py found in home/home/")
else:
    print(f"❌ manage.py not found!")

# Test imports
print(f"\n" + "=" * 50)
print("TESTING PYTHON IMPORTS")
print("=" * 50)

print(f"Python path: {sys.path}")

try:
    import home
    print(f"✅ import home works! Location: {home.__file__}")
except ImportError as e:
    print(f"❌ import home failed: {e}")

try:
    import home.home
    print(f"✅ import home.home works! Location: {home.home.__file__}")
except ImportError as e:
    print(f"❌ import home.home failed: {e}")

try:
    from home import wsgi
    print(f"✅ from home import wsgi works!")
except ImportError as e:
    print(f"❌ from home import wsgi failed: {e}")

try:
    from home.home import wsgi
    print(f"✅ from home.home import wsgi works!")
except ImportError as e:
    print(f"❌ from home.home import wsgi failed: {e}")

print("\n" + "=" * 50)
print("RECOMMENDATION")
print("=" * 50)

if os.path.exists('home/home') and os.path.exists('home/home/wsgi.py'):
    print("👉 You have NESTED folders. Use:")
    print("   gunicorn home.home.wsgi:application")
    print("\n   In gunicorn.conf.py, set:")
    print('   wsgi_app = "home.home.wsgi:application"')
elif os.path.exists('home/wsgi.py'):
    print("👉 You have FLAT structure. Use:")
    print("   gunicorn home.wsgi:application")
else:
    print("👉 Structure unclear. Please fix your folder layout.")