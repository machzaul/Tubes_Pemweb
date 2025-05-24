#!/usr/bin/env python3
"""
Script to create default admin user
Run this after migration: python create_admin.py
"""

import os
import sys
from pyramid.paster import get_appsettings, setup_logging
from pyramid.scripts.common import parse_vars

# Add project path
sys.path.append(os.path.dirname(__file__))

from product_api.models import get_engine, get_session_factory, Admin

def create_default_admin():
    """Create default admin user"""
    config_uri = 'development.ini'  # Adjust path as needed
    
    try:
        setup_logging(config_uri)
        settings = get_appsettings(config_uri)
        
        engine = get_engine(settings)
        session_factory = get_session_factory(engine)
        session = session_factory()
        
        # Check if admin already exists
        existing_admin = session.query(Admin).filter(Admin.username == 'admin').first()
        if existing_admin:
            print("Default admin already exists!")
            return
        
        # Create default admin
        admin = Admin(username='admin')
        admin.set_password('admin123')  # Change this password!
        
        session.add(admin)
        session.commit()
        
        print("Default admin created successfully!")
        print("Username: admin")
        print("Password: admin123")
        print("Please change the password after first login!")
        
    except Exception as e:
        print(f"Error creating admin: {e}")
        session.rollback()
    finally:
        session.close()

if __name__ == '__main__':
    create_default_admin()