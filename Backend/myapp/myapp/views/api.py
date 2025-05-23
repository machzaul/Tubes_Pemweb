from pyramid.view import view_config
from pyramid.response import Response
from pyramid.httpexceptions import HTTPNotFound, HTTPBadRequest
from sqlalchemy.exc import DBAPIError
from ..models import Product

@view_config(route_name='products', request_method='GET', renderer='json')
def get_products(request):
    return {"message": "Success! This is the products API."}

@view_config(route_name='products', renderer='json', request_method='POST')
def add_product(request):
    data = request.json_body
    try:
        new_p = Product(name=data['name'], price=data['price'])
        request.dbsession.add(new_p)
        return {'message': 'Product added'}
    except:
        return HTTPBadRequest(json_body={'error': 'Invalid input'})
