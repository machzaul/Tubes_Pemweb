from pyramid.response import Response
from pyramid.view import view_config
import json
from sqlalchemy.exc import SQLAlchemyError
from ..models import CustomerInfo

@view_config(route_name='customer_info_list', request_method='GET', renderer='json')
def get_customers(request):
    """Get all customers"""
    try:
        customers = request.dbsession.query(CustomerInfo).all()
        return {'customers': [customer.to_dict() for customer in customers]}
    except SQLAlchemyError as e:
        return Response(json.dumps({'error': str(e)}), status=500, content_type='application/json; charset=UTF-8')

@view_config(route_name='customer_info', request_method='GET', renderer='json')
def get_customer(request):
    """Get single customer"""
    try:
        customer_id = int(request.matchdict['id'])
        customer = request.dbsession.query(CustomerInfo).filter(CustomerInfo.id == customer_id).first()
        if not customer:
            return Response(json.dumps({'error': 'Customer not found'}), status=404, content_type='application/json; charset=UTF-8')
        return customer.to_dict()
    except (ValueError, SQLAlchemyError) as e:
        return Response(json.dumps({'error': str(e)}), status=400, content_type='application/json; charset=UTF-8')

@view_config(route_name='customer_info_list', request_method='POST', renderer='json')
def create_customer(request):
    """Create new customer"""
    try:
        data = request.json_body
        customer = CustomerInfo(
            full_name=data.get('fullName'),
            email=data.get('email'),
            address=data.get('address'),
            phone_number=data.get('phoneNumber')
        )
        
        # Validation
        if not all([customer.full_name, customer.email, customer.address, customer.phone_number]):
            return Response(json.dumps({'error': 'All fields are required'}), status=400, content_type='application/json; charset=UTF-8')
        
        request.dbsession.add(customer)
        request.dbsession.flush()
        return customer.to_dict()
    except (ValueError, KeyError, SQLAlchemyError) as e:
        return Response(json.dumps({'error': str(e)}), status=400, content_type='application/json; charset=UTF-8')

@view_config(route_name='customer_info', request_method='PUT', renderer='json')
def update_customer(request):
    """Update customer"""
    try:
        customer_id = int(request.matchdict['id'])
        customer = request.dbsession.query(CustomerInfo).filter(CustomerInfo.id == customer_id).first()
        if not customer:
            return Response(json.dumps({'error': 'Customer not found'}), status=404, content_type='application/json; charset=UTF-8')
        
        data = request.json_body
        customer.full_name = data.get('fullName', customer.full_name)
        customer.email = data.get('email', customer.email)
        customer.address = data.get('address', customer.address)
        customer.phone_number = data.get('phoneNumber', customer.phone_number)
        
        return customer.to_dict()
    except (ValueError, KeyError, SQLAlchemyError) as e:
        return Response(json.dumps({'error': str(e)}), status=400, content_type='application/json; charset=UTF-8')

@view_config(route_name='customer_info', request_method='DELETE', renderer='json')
def delete_customer(request):
    """Delete customer"""
    try:
        customer_id = int(request.matchdict['id'])
        customer = request.dbsession.query(CustomerInfo).filter(CustomerInfo.id == customer_id).first()
        if not customer:
            return Response(json.dumps({'error': 'Customer not found'}), status=404, content_type='application/json; charset=UTF-8')
        
        request.dbsession.delete(customer)
        return {'message': 'Customer deleted successfully'}
    except (ValueError, SQLAlchemyError) as e:
        return Response(json.dumps({'error': str(e)}), status=400, content_type='application/json; charset=UTF-8')