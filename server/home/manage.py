import os
import sys

def main():
    # This line is crucial - it should point to the nested settings
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'home.home.settings')

    # Add paths (your existing path code)
    current_dir = os.path.dirname(os.path.abspath(__file__))
    parent_dir = os.path.dirname(current_dir)
    sys.path.insert(0, parent_dir)
    sys.path.insert(0, current_dir)

    try:
        from django.core.management import execute_from_command_line
    except ImportError as exc:
        raise ImportError(...) from exc
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    main()