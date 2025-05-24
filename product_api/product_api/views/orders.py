from pyramid.response import Response
from pyramid.view import view_config
import json
import uuid
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError
from ..models import Order, OrderItem, CustomerInfo, Product

@view_config(route_name='orders', request_method='GET', renderer='json')
def get_orders(request):
    """Get all orders"""
    try:
        orders = request.dbsession.query(Order).all()
        return {'orders': [order.to_dict() for order in orders]}
    except SQLAlchemyError as e:
        return Response(json.dumps({'error': str(e)}), status=500, content_type='application/json; charset=UTF-8')

@view_config(route_name='order', request_method='GET', renderer='json')
def get_order(request):
    """Get single order"""
    try:
        order_id = int(request.matchdict['id'])
        order = request.dbsession.query(Order).filter(Order.id == order_id).first()
        if not order:
            return Response(json.dumps({'error': 'Order not found'}), status=404, content_type='application/json; charset=UTF-8')
        return order.to_dict()
    except (ValueError, SQLAlchemyError) as e:
        return Response(json.dumps({'error': str(e)}), status=400, content_type='application/json; charset=UTF-8')

@view_config(route_name='orders', request_method='POST', renderer='json')
def create_order(request):
    """Create new order"""
    try:
        data = request.json_body
        
        # Generate unique order ID
        order_id = f"ORD-{uuid.uuid4().hex[:8].upper()}"
        
        # Create or get customer info
        customer_data = data.get('customerInfo', {})
        customer = CustomerInfo(
            full_name=customer_data.get('fullName'),
            email=customer_data.get('email'),
            address=customer_data.get('address'),
            phone_number=customer_data.get('phoneNumber')
        )
        request.dbsession.add(customer)
        request.dbsession.flush()  # Get customer ID
        
        # Create order
        order = Order(
            order_id=order_id,
            customer_info_id=customer.id,
            subtotal=data.get('subtotal', 0),
            shipping=data.get('shipping', 0),
            total=data.get('total', 0),
            status=data.get('status', 'pending'),
            status_history=data.get('statusHistory', []),
            order_date=datetime.now()
        )
        request.dbsession.add(order)
        request.dbsession.flush()  # Get order ID
        
        # Create order items
        items = data.get('items', [])
        for item_data in items:
            # Get product to ensure it exists and get current price
            product = request.dbsession.query(Product).filter(Product.id == item_data.get('id')).first()
            if not product:
                return Response(json.dumps({'error': f'Product with id {item_data.get("id")} not found'}), 
                              status=400, content_type='application/json; charset=UTF-8')
            
            order_item = OrderItem(
                order_id=order.id,
                product_id=product.id,
                quantity=item_data.get('quantity', 1),
                price=product.price  # Use current product price
            )
            request.dbsession.add(order_item)
        
        request.dbsession.flush()
        return order.to_dict()
        
    except (ValueError, KeyError, SQLAlchemyError) as e:
        return Response(json.dumps({'error': str(e)}), status=400, content_type='application/json; charset=UTF-8')

@view_config(route_name='order_status', request_method='PUT', renderer='json')
def update_order_status(request):
    """Update order status"""
    try:
        order_id = int(request.matchdict['id'])
        order = request.dbsession.query(Order).filter(Order.id == order_id).first()
        if not order:
            return Response(json.dumps({'error': 'Order not found'}), status=404, content_type='application/json; charset=UTF-8')
        
        data = request.json_body
        new_status = data.get('status')
        note = data.get('note', '')
        updated_by = data.get('updatedBy', 'admin')
        
        if not new_status:
            return Response(json.dumps({'error': 'Status is required'}), status=400, content_type='application/json; charset=UTF-8')
        
        # Update status
        order.status = new_status
        
        # Add to status history
        if not order.status_history:
            order.status_history = []
        
        status_update = {
            'status': new_status,
            'timestamp': datetime.now().isoformat(),
            'updatedBy': updated_by,
            'note': note
        }
        order.status_history.append(status_update)
        
        return order.to_dict()
        
    except (ValueError, KeyError, SQLAlchemyError) as e:
        return Response(json.dumps({'error': str(e)}), status=400, content_type='application/json; charset=UTF-8')

@view_config(route_name='order', request_method='DELETE', renderer='json')
def delete_order(request):
    """Delete order"""
    try:
        order_id = int(request.matchdict['id'])
        order = request.dbsession.query(Order).filter(Order.id == order_id).first()
        if not order:
            return Response(json.dumps({'error': 'Order not found'}), status=404, content_type='application/json; charset=UTF-8')
        
        request.dbsession.delete(order)
        return {'message': 'Order deleted successfully'}
    except (ValueError, SQLAlchemyError) as e:
        return Response(json.dumps({'error': str(e)}), status=400, content_type='application/json; charset=UTF-8')