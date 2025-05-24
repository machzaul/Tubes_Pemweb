from pyramid.response import Response
from pyramid.httpexceptions import HTTPOk
from pyramid.view import view_config
import json
import jwt
from datetime import datetime, timedelta
from sqlalchemy.exc import SQLAlchemyError
from ..models import Admin

# JWT Secret - In production, use environment variable
JWT_SECRET = 'your-secret-key-here'  # Change this to a secure secret
JWT_ALGORITHM = 'HS256'
JWT_EXPIRATION_HOURS = 24

@view_config(route_name='admin_login', request_method='POST', renderer='json')
def admin_login(request):
    """Admin login"""
    try:
        data = request.json_body
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return Response(json.dumps({'error': 'Username and password are required'}), 
                          status=400, content_type='application/json; charset=UTF-8')
        
        # Find admin by username
        admin = request.dbsession.query(Admin).filter(Admin.username == username).first()
        if not admin or not admin.check_password(password):
            return Response(json.dumps({'error': 'Invalid username or password'}), 
                          status=401, content_type='application/json; charset=UTF-8')
        
        if not admin.is_active:
            return Response(json.dumps({'error': 'Account is deactivated'}), 
                          status=401, content_type='application/json; charset=UTF-8')
        
        # Update last login
        admin.last_login = datetime.now()
        
        # Generate JWT token
        payload = {
            'admin_id': admin.id,
            'username': admin.username,
            'exp': datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
            'iat': datetime.utcnow()
        }
        token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
        
        return {
            'message': 'Login successful',
            'token': token,
            'admin': admin.to_dict()
        }
        
    except (ValueError, KeyError, SQLAlchemyError) as e:
        return Response(json.dumps({'error': str(e)}), status=400, content_type='application/json; charset=UTF-8')
    
@view_config(route_name='admin_login', request_method='OPTIONS', renderer='json')
def admin_login_options(request):
    return HTTPOk()

@view_config(route_name='admin_logout', request_method='POST', renderer='json')
def admin_logout(request):
    """Admin logout"""
    # For JWT, logout is handled client-side by removing the token
    return {'message': 'Logout successful'}

@view_config(route_name='admin_create', request_method='POST', renderer='json')
def create_admin(request):
    """Create new admin account"""
    try:
        data = request.json_body
        username = data.get('username')
        password = data.get('password')
        
        if not username or not password:
            return Response(json.dumps({'error': 'Username and password are required'}), 
                          status=400, content_type='application/json; charset=UTF-8')
        
        # Check if username already exists
        existing_admin = request.dbsession.query(Admin).filter(Admin.username == username).first()
        if existing_admin:
            return Response(json.dumps({'error': 'Username already exists'}), 
                          status=400, content_type='application/json; charset=UTF-8')
        
        # Create new admin
        admin = Admin(username=username)
        admin.set_password(password)
        
        request.dbsession.add(admin)
        request.dbsession.flush()
        
        return {
            'message': 'Admin created successfully',
            'admin': admin.to_dict()
        }
        
    except (ValueError, KeyError, SQLAlchemyError) as e:
        return Response(json.dumps({'error': str(e)}), status=400, content_type='application/json; charset=UTF-8')
    
@view_config(route_name='admin_create', request_method='OPTIONS', renderer='json')
def admin_profile_options(request):
    return HTTPOk()

@view_config(route_name='admin_profile', request_method='GET', renderer='json')
def get_admin_profile(request):
    """Get admin profile (requires authentication)"""
    try:
        # Get token from Authorization header
        auth_header = request.headers.get('Authorization')
        if not auth_header or not auth_header.startswith('Bearer '):
            return Response(json.dumps({'error': 'Authorization token required'}), 
                          status=401, content_type='application/json; charset=UTF-8')
        
        token = auth_header.split(' ')[1]
        
        try:
            # Decode JWT token
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
            admin_id = payload.get('admin_id')
            
            # Get admin from database
            admin = request.dbsession.query(Admin).filter(Admin.id == admin_id).first()
            if not admin:
                return Response(json.dumps({'error': 'Admin not found'}), 
                              status=404, content_type='application/json; charset=UTF-8')
            
            return admin.to_dict()
            
        except jwt.ExpiredSignatureError:
            return Response(json.dumps({'error': 'Token has expired'}), 
                          status=401, content_type='application/json; charset=UTF-8')
        except jwt.InvalidTokenError:
            return Response(json.dumps({'error': 'Invalid token'}), 
                          status=401, content_type='application/json; charset=UTF-8')
        
    except Exception as e:
        return Response(json.dumps({'error': str(e)}), status=400, content_type='application/json; charset=UTF-8')
    
@view_config(route_name='admin_profile', request_method='OPTIONS', renderer='json')
def admin_profile_options(request):
    return HTTPOk()