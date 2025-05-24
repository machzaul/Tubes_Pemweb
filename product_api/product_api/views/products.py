from pyramid.response import Response
from pyramid.view import view_config
import json
from sqlalchemy.exc import SQLAlchemyError
from ..models import Product

@view_config(route_name='products', request_method='GET', renderer='json')
def get_products(request):
    """Get all products"""
    try:
        products = request.dbsession.query(Product).all()
        return {'products': [product.to_dict() for product in products]}
    except SQLAlchemyError as e:
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
        return Response(json.dumps({'error': str(e)}), status=400, content_type='application/json; charset=UTF-8')

@view_config(route_name='products', request_method='POST', renderer='json')
def create_product(request):
    """Create new product"""
    try:
        data = request.json_body
        product = Product(
            title=data.get('title'),
            description=data.get('description'),
            price=data.get('price'),
            stock=data.get('stock', 0),
            image=data.get('image')
        )
        request.dbsession.add(product)
        request.dbsession.flush()  # Flush to get the ID
        return product.to_dict()
    except (ValueError, KeyError, SQLAlchemyError) as e:
        return Response(json.dumps({'error': str(e)}), status=400, content_type='application/json; charset=UTF-8')

@view_config(route_name='product', request_method='PUT', renderer='json')
def update_product(request):
    """Update product"""
    try:
        product_id = int(request.matchdict['id'])
        product = request.dbsession.query(Product).filter(Product.id == product_id).first()
        if not product:
            return Response(json.dumps({'error': 'Product not found'}), status=404, content_type='application/json; charset=UTF-8')
        
        data = request.json_body
        product.title = data.get('title', product.title)
        product.description = data.get('description', product.description)
        product.price = data.get('price', product.price)
        product.stock = data.get('stock', product.stock)
        product.image = data.get('image', product.image)
        
        return product.to_dict()
    except (ValueError, KeyError, SQLAlchemyError) as e:
        return Response(json.dumps({'error': str(e)}), status=400, content_type='application/json; charset=UTF-8')

@view_config(route_name='product', request_method='DELETE', renderer='json')
def delete_product(request):
    """Delete product"""
    try:
        product_id = int(request.matchdict['id'])
        product = request.dbsession.query(Product).filter(Product.id == product_id).first()
        if not product:
            return Response(json.dumps({'error': 'Product not found'}), status=404, content_type='application/json; charset=UTF-8')
        
        request.dbsession.delete(product)
        return {'message': 'Product deleted successfully'}
    except (ValueError, SQLAlchemyError) as e:
        return Response(json.dumps({'error': str(e)}), status=400, content_type='application/json; charset=UTF-8')