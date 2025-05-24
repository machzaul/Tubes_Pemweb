from pyramid.response import Response
from pyramid.view import view_config
import json
from sqlalchemy.exc import SQLAlchemyError
from ..models import Product
import logging

log = logging.getLogger(__name__)

@view_config(route_name='products', request_method='GET', renderer='json')
def get_products(request):
    """Get all products"""
    try:
        products = request.dbsession.query(Product).all()
        return {'products': [product.to_dict() for product in products]}
    except SQLAlchemyError as e:
        log.error(f"Error getting products: {e}")
        return Response(json.dumps({'error': str(e)}), status=500, content_type='application/json; charset=UTF-8')

@view_config(route_name='product', request_method='GET', renderer='json')
def get_product(request):
    """Get single product"""
    try:
        product_id = int(request.matchdict['id'])
        product = request.dbsession.query(Product).filter(Product.id == product_id).first()
        if not product:
            return Response(json.dumps({'error': 'Product not found'}), status=404, content_type='application/json; charset=UTF-8')
        return product.to_dict()
    except (ValueError, SQLAlchemyError) as e:
        log.error(f"Error getting product {request.matchdict.get('id')}: {e}")
        return Response(json.dumps({'error': str(e)}), status=400, content_type='application/json; charset=UTF-8')

@view_config(route_name='products', request_method='POST', renderer='json', accept='application/json; charset=UTF-8')
def create_product(request):
    """Create new product"""
    try:
        log.info(f"Creating product - Content-Type: {request.content_type}")
        log.info(f"Request body: {request.body}")
        
        # Handle both application/json and other content types
        if hasattr(request, 'json_body') and request.json_body:
            data = request.json_body
        else:
            # Fallback for other content types
            try:
                data = json.loads(request.body.decode('utf-8'))
            except (json.JSONDecodeError, UnicodeDecodeError) as e:
                log.error(f"Error parsing request body: {e}")
                return Response(
                    json.dumps({'error': 'Invalid JSON data'}), 
                    status=400, 
                    content_type='application/json; charset=UTF-8'
                )
        
        # Validate required fields
        required_fields = ['title', 'description', 'price']
        for field in required_fields:
            if not data.get(field):
                return Response(
                    json.dumps({'error': f'{field} is required'}), 
                    status=400, 
                    content_type='application/json; charset=UTF-8'
                )
        
        # Create product
        product = Product(
            title=data.get('title'),
            description=data.get('description'),
            price=float(data.get('price')),
            stock=int(data.get('stock', 0)),
            image=data.get('image')
        )
        
        request.dbsession.add(product)
        request.dbsession.flush()  # Flush to get the ID
        
        log.info(f"Product created successfully: {product.id}")
        return Response(
            json.dumps(product.to_dict()),
            status=201,
            content_type='application/json; charset=UTF-8'
        )
        
    except (ValueError, TypeError) as e:
        log.error(f"Validation error creating product: {e}")
        return Response(
            json.dumps({'error': f'Invalid data: {str(e)}'}), 
            status=400, 
            content_type='application/json; charset=UTF-8'
        )
    except SQLAlchemyError as e:
        log.error(f"Database error creating product: {e}")
        return Response(
            json.dumps({'error': 'Database error occurred'}), 
            status=500, 
            content_type='application/json; charset=UTF-8'
        )
    except Exception as e:
        log.error(f"Unexpected error creating product: {e}")
        return Response(
            json.dumps({'error': 'An unexpected error occurred'}), 
            status=500, 
            content_type='application/json; charset=UTF-8'
        )

@view_config(route_name='product', request_method='PUT', renderer='json', accept='application/json; charset=UTF-8')
def update_product(request):
    """Update product"""
    try:
        product_id = int(request.matchdict['id'])
        product = request.dbsession.query(Product).filter(Product.id == product_id).first()
        
        if not product:
            return Response(
                json.dumps({'error': 'Product not found'}), 
                status=404, 
                content_type='application/json; charset=UTF-8'
            )
        
        # Handle both application/json and other content types
        if hasattr(request, 'json_body') and request.json_body:
            data = request.json_body
        else:
            try:
                data = json.loads(request.body.decode('utf-8'))
            except (json.JSONDecodeError, UnicodeDecodeError) as e:
                log.error(f"Error parsing request body: {e}")
                return Response(
                    json.dumps({'error': 'Invalid JSON data'}), 
                    status=400, 
                    content_type='application/json; charset=UTF-8'
                )
        
        # Update product fields
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
        
        log.info(f"Product updated successfully: {product.id}")
        return Response(
            json.dumps(product.to_dict()),
            status=200,
            content_type='application/json; charset=UTF-8'
        )
        
    except (ValueError, TypeError) as e:
        log.error(f"Validation error updating product: {e}")
        return Response(
            json.dumps({'error': f'Invalid data: {str(e)}'}), 
            status=400, 
            content_type='application/json; charset=UTF-8'
        )
    except SQLAlchemyError as e:
        log.error(f"Database error updating product: {e}")
        return Response(
            json.dumps({'error': 'Database error occurred'}), 
            status=500, 
            content_type='application/json; charset=UTF-8'
        )
    except Exception as e:
        log.error(f"Unexpected error updating product: {e}")
        return Response(
            json.dumps({'error': 'An unexpected error occurred'}), 
            status=500, 
            content_type='application/json; charset=UTF-8'
        )

@view_config(route_name='product', request_method='DELETE', renderer='json')
def delete_product(request):
    """Delete product"""
    try:
        product_id = int(request.matchdict['id'])
        product = request.dbsession.query(Product).filter(Product.id == product_id).first()
        
        if not product:
            return Response(
                json.dumps({'error': 'Product not found'}), 
                status=404, 
                content_type='application/json; charset=UTF-8'
            )
        
        request.dbsession.delete(product)
        log.info(f"Product deleted successfully: {product_id}")
        
        return Response(
            json.dumps({'message': 'Product deleted successfully'}),
            status=200,
            content_type='application/json; charset=UTF-8'
        )
        
    except (ValueError, SQLAlchemyError) as e:
        log.error(f"Error deleting product: {e}")
        return Response(
            json.dumps({'error': str(e)}), 
            status=400, 
            content_type='application/json; charset=UTF-8'
        )

# Add a debug view to help troubleshoot
@view_config(route_name='products', request_method='OPTIONS')
def products_options(request):
    """Handle CORS preflight requests"""
    log.info("Handling OPTIONS request for products")
    response = Response()
    response.headers['Access-Control-Allow-Origin'] = 'http://localhost:3000'
    response.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS'
    response.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization'
    response.headers['Access-Control-Max-Age'] = '86400'
    return response

@view_config(route_name='product', request_method='OPTIONS', renderer='json')
def product_options(request):
    """Local OPTIONS handler to satisfy Pyramid's predicate match"""
    from pyramid.httpexceptions import HTTPOk
    return HTTPOk()