
from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest, HTTPCreated
from sqlalchemy.exc import DBAPIError, IntegrityError
from sqlalchemy.orm.exc import NoResultFound
from ..models.mymodel import Product
import json

# GET all products
@view_config(route_name='products', request_method='GET', renderer='json')
def get_products(request):
    """Get all products"""
    try:
        products = request.dbsession.query(Product).all()
        return {
            'status': 'success',
            'data': [product.to_dict() for product in products],
            'count': len(products)
        }
    except Exception as e:
        return {'status': 'error', 'message': str(e)}

# GET single product by ID
@view_config(route_name='product_detail', request_method='GET', renderer='json')
def get_product(request):
    """Get single product by ID"""
    try:
        product_id = int(request.matchdict['id'])
        product = request.dbsession.query(Product).filter(Product.id == product_id).first()
        
        if not product:
            request.response.status = 404
            return {'status': 'error', 'message': 'Product not found'}
        
        return {
            'status': 'success',
            'data': product.to_dict()
        }
    except ValueError:
        request.response.status = 400
        return {'status': 'error', 'message': 'Invalid product ID'}
    except Exception as e:
        request.response.status = 500
        return {'status': 'error', 'message': str(e)}

# POST - Create new product
@view_config(route_name='product_create', request_method='POST', renderer='json')
def create_product(request):
    """Create new product"""
    try:
        data = request.json_body
        
        # Validate required fields
        required_fields = ['title', 'price']
        for field in required_fields:
            if field not in data or not data[field]:
                request.response.status = 400
                return {'status': 'error', 'message': f'Field {field} is required'}
        
        # Create new product
        new_product = Product(
            title=data['title'],
            description=data.get('description', ''),
            price=float(data['price']),
            stock=int(data.get('stock', 0)),
            image=data.get('image', '')
        )
        
        request.dbsession.add(new_product)
        request.dbsession.flush()  # To get the ID
        
        request.response.status = 201
        return {
            'status': 'success',
            'message': 'Product created successfully',
            'data': new_product.to_dict()
        }
        
    except ValueError as e:
        request.response.status = 400
        return {'status': 'error', 'message': 'Invalid data type for price or stock'}
    except IntegrityError as e:
        request.response.status = 400
        return {'status': 'error', 'message': 'Database integrity error'}
    except Exception as e:
        request.response.status = 500
        return {'status': 'error', 'message': str(e)}

# Alternative POST route for creating products (using /api/products directly)
@view_config(route_name='products', request_method='POST', renderer='json')
def add_product(request):
    """Alternative endpoint to create product"""
    return create_product(request)

# PUT - Update product
@view_config(route_name='product_update', request_method='PUT', renderer='json')
def update_product(request):
    """Update existing product"""
    try:
        product_id = int(request.matchdict['id'])
        data = request.json_body
        
        product = request.dbsession.query(Product).filter(Product.id == product_id).first()
        
        if not product:
            request.response.status = 404
            return {'status': 'error', 'message': 'Product not found'}
        
        # Update fields if provided
        if 'title' in data:
            product.title = data['title']
        if 'description' in data:
            product.description = data['description']
        if 'price' in data:
            product.price = float(data['price'])
        if 'stock' in data:
            product.stock = int(data['stock'])
        if 'image' in data:
            product.image = data['image']
        
        return {
            'status': 'success',
            'message': 'Product updated successfully',
            'data': product.to_dict()
        }
        
    except ValueError:
        request.response.status = 400
        return {'status': 'error', 'message': 'Invalid product ID or data type'}
    except Exception as e:
        request.response.status = 500
        return {'status': 'error', 'message': str(e)}

# Alternative PUT route (using product_detail route)
@view_config(route_name='product_detail', request_method='PUT', renderer='json')
def update_product_alt(request):
    """Alternative endpoint to update product"""
    return update_product(request)

# DELETE product
@view_config(route_name='product_delete', request_method='DELETE', renderer='json')
def delete_product(request):
    """Delete product"""
    try:
        product_id = int(request.matchdict['id'])
        
        product = request.dbsession.query(Product).filter(Product.id == product_id).first()
        
        if not product:
            request.response.status = 404
            return {'status': 'error', 'message': 'Product not found'}
        
        # Store product data before deletion for response
        deleted_product = product.to_dict()
        
        request.dbsession.delete(product)
        
        return {
            'status': 'success',
            'message': 'Product deleted successfully',
            'data': deleted_product
        }
        
    except ValueError:
        request.response.status = 400
        return {'status': 'error', 'message': 'Invalid product ID'}
    except Exception as e:
        request.response.status = 500
        return {'status': 'error', 'message': str(e)}

# Alternative DELETE route (using product_detail route)
@view_config(route_name='product_detail', request_method='DELETE', renderer='json')
def delete_product_alt(request):
    """Alternative endpoint to delete product"""
    return delete_product(request)