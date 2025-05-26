import pytest
import json
import uuid
from datetime import datetime, timedelta
from pyramid import testing
from pyramid.testing import DummyRequest
from pyramid.httpexceptions import HTTPOk
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from unittest.mock import Mock, patch
import jwt

# Import your models and views
from product_api.models.meta import Base
from product_api.models.product import Product
from product_api.models.customer_info import CustomerInfo
from product_api.models.order import Order, OrderItem
from product_api.models.admin import Admin
from product_api.views import products, customer_info, orders, admin

# Test configuration
@pytest.fixture(scope="session")
def engine():
    """Create test database engine"""
    return create_engine('sqlite:///:memory:', echo=False)

@pytest.fixture(scope="session")
def tables(engine):
    """Create all tables"""
    Base.metadata.create_all(engine)
    yield
    Base.metadata.drop_all(engine)

@pytest.fixture
def dbsession(engine, tables):
    """Create test database session"""
    connection = engine.connect()
    transaction = connection.begin()
    Session = sessionmaker(bind=connection)
    session = Session()
    
    yield session
    
    session.close()
    transaction.rollback()
    connection.close()

@pytest.fixture
def config():
    """Create Pyramid test configuration"""
    config = testing.setUp()
    yield config
    testing.tearDown()

@pytest.fixture
def dummy_request(dbsession):
    """Create dummy request with database session"""
    request = DummyRequest()
    request.dbsession = dbsession
    request.json_body = {}
    return request


# =============================================================================
# MODEL TESTS
# =============================================================================

class TestProductModel:
    def test_product_creation(self, dbsession):
        """Test product model creation"""
        product = Product(
            title="Test Product",
            description="Test Description",
            price=29.99,
            stock=10,
            image="test.jpg"
        )
        dbsession.add(product)
        dbsession.flush()
        
        assert product.id is not None
        assert product.title == "Test Product"
        assert float(product.price) == 29.99
    
    def test_product_to_dict(self, dbsession):
        """Test product to_dict method"""
        product = Product(
            title="Test Product",
            description="Test Description",
            price=29.99,
            stock=10,
            image="test.jpg"
        )
        dbsession.add(product)
        dbsession.flush()
        
        product_dict = product.to_dict()
        
        assert product_dict['title'] == "Test Product"
        assert product_dict['price'] == 29.99
        assert product_dict['stock'] == 10


class TestCustomerInfoModel:
    def test_customer_creation(self, dbsession):
        """Test customer model creation"""
        customer = CustomerInfo(
            full_name="John Doe",
            email="john@example.com",
            address="123 Main St",
            phone_number="555-1234"
        )
        dbsession.add(customer)
        dbsession.flush()
        
        assert customer.id is not None
        assert customer.full_name == "John Doe"
        assert customer.email == "john@example.com"
    
    def test_customer_to_dict(self, dbsession):
        """Test customer to_dict method"""
        customer = CustomerInfo(
            full_name="John Doe",
            email="john@example.com",
            address="123 Main St",
            phone_number="555-1234"
        )
        dbsession.add(customer)
        dbsession.flush()
        
        customer_dict = customer.to_dict()
        
        assert customer_dict['fullName'] == "John Doe"
        assert customer_dict['email'] == "john@example.com"


class TestAdminModel:
    def test_admin_creation(self, dbsession):
        """Test admin model creation"""
        admin = Admin(username="testadmin")
        admin.set_password("testpassword")
        
        dbsession.add(admin)
        dbsession.flush()
        
        assert admin.id is not None
        assert admin.username == "testadmin"
        assert admin.password_hash is not None
    
    def test_password_verification(self):
        """Test password hashing and verification"""
        admin = Admin(username="testadmin")
        admin.set_password("testpassword")
        
        assert admin.check_password("testpassword") is True
        assert admin.check_password("wrongpassword") is False


class TestOrderModel:
    def test_order_creation(self, dbsession):
        """Test order model creation"""
        # Create customer first
        customer = CustomerInfo(
            full_name="John Doe",
            email="john@example.com",
            address="123 Main St",
            phone_number="555-1234"
        )
        dbsession.add(customer)
        dbsession.flush()
        
        # Create order
        order = Order(
            order_id="ORD-12345",
            customer_info_id=customer.id,
            subtotal=100.00,
            shipping=10.00,
            total=110.00,
            status="pending"
        )
        dbsession.add(order)
        dbsession.flush()
        
        assert order.id is not None
        assert order.order_id == "ORD-12345"
        assert float(order.total) == 110.00


# =============================================================================
# PRODUCT VIEW TESTS
# =============================================================================

class TestProductViews:
    def test_get_products_empty(self, dummy_request):
        """Test getting products when none exist"""
        response = products.get_products(dummy_request)
        assert response == {'products': []}
    
    def test_get_products_with_data(self, dummy_request, dbsession):
        """Test getting products with data"""
        # Add test products
        product1 = Product(title="Product 1", description="Desc 1", price=10.00)
        product2 = Product(title="Product 2", description="Desc 2", price=20.00)
        dbsession.add_all([product1, product2])
        dbsession.flush()
        
        response = products.get_products(dummy_request)
        assert len(response['products']) == 2
        assert response['products'][0]['title'] == "Product 1"
    
    def test_get_single_product_success(self, dummy_request, dbsession):
        """Test getting a single product successfully"""
        product = Product(title="Test Product", description="Test", price=10.00)
        dbsession.add(product)
        dbsession.flush()
        
        dummy_request.matchdict = {'id': str(product.id)}
        response = products.get_product(dummy_request)
        
        assert response['title'] == "Test Product"
    
    def test_get_single_product_not_found(self, dummy_request):
        """Test getting a non-existent product"""
        dummy_request.matchdict = {'id': '999'}
        response = products.get_product(dummy_request)
        
        assert response.status_code == 404
    
    def test_create_product_success(self, dummy_request):
        """Test creating a product successfully"""
        dummy_request.json_body = {
            'title': 'New Product',
            'description': 'New Description',
            'price': 29.99,
            'stock': 10,
            'image': 'new.jpg'
        }
        
        response = products.create_product(dummy_request)
        assert response.status_code == 201
    
    def test_create_product_missing_fields(self, dummy_request):
        """Test creating a product with missing required fields"""
        dummy_request.json_body = {
            'title': 'New Product'
            # Missing description and price
        }
        
        response = products.create_product(dummy_request)
        assert response.status_code == 400
    
    def test_update_product_success(self, dummy_request, dbsession):
        """Test updating a product successfully"""
        product = Product(title="Old Product", description="Old", price=10.00)
        dbsession.add(product)
        dbsession.flush()
        
        dummy_request.matchdict = {'id': str(product.id)}
        dummy_request.json_body = {
            'title': 'Updated Product',
            'price': 15.00
        }
        
        response = products.update_product(dummy_request)
        assert response.status_code == 200
    
    def test_delete_product_success(self, dummy_request, dbsession):
        """Test deleting a product successfully"""
        product = Product(title="To Delete", description="Delete", price=10.00)
        dbsession.add(product)
        dbsession.flush()
        
        dummy_request.matchdict = {'id': str(product.id)}
        response = products.delete_product(dummy_request)
        
        assert response.status_code == 200


# =============================================================================
# CUSTOMER INFO VIEW TESTS
# =============================================================================

class TestCustomerInfoViews:
    def test_get_customers_empty(self, dummy_request):
        """Test getting customers when none exist"""
        response = customer_info.get_customers(dummy_request)
        assert response == {'customers': []}
    
    def test_create_customer_success(self, dummy_request):
        """Test creating a customer successfully"""
        dummy_request.json_body = {
            'fullName': 'John Doe',
            'email': 'john@example.com',
            'address': '123 Main St',
            'phoneNumber': '555-1234'
        }
        
        response = customer_info.create_customer(dummy_request)
        assert response['fullName'] == 'John Doe'
    
    def test_create_customer_missing_fields(self, dummy_request):
        """Test creating a customer with missing fields"""
        dummy_request.json_body = {
            'fullName': 'John Doe'
            # Missing other required fields
        }
        
        response = customer_info.create_customer(dummy_request)
        assert response.status_code == 400
    
    def test_update_customer_success(self, dummy_request, dbsession):
        """Test updating a customer successfully"""
        customer = CustomerInfo(
            full_name="John Doe",
            email="john@example.com",
            address="123 Main St",
            phone_number="555-1234"
        )
        dbsession.add(customer)
        dbsession.flush()
        
        dummy_request.matchdict = {'id': str(customer.id)}
        dummy_request.json_body = {
            'fullName': 'Jane Doe',
            'email': 'jane@example.com'
        }
        
        response = customer_info.update_customer(dummy_request)
        assert response['fullName'] == 'Jane Doe'


# =============================================================================
# ORDER VIEW TESTS
# =============================================================================

class TestOrderViews:
    def test_get_orders_empty(self, dummy_request):
        """Test getting orders when none exist"""
        response = orders.get_orders(dummy_request)
        assert response == {'orders': []}
    
    def test_create_order_success(self, dummy_request, dbsession):
        """Test creating an order successfully"""
        # Create a product first
        product = Product(title="Test Product", description="Test", price=10.00, stock=5)
        dbsession.add(product)
        dbsession.flush()
        
        dummy_request.json_body = {
            'customerInfo': {
                'fullName': 'John Doe',
                'email': 'john@example.com',
                'address': '123 Main St',
                'phoneNumber': '555-1234'
            },
            'items': [
                {
                    'id': product.id,
                    'quantity': 2
                }
            ],
            'subtotal': 20.00,
            'shipping': 5.00,
            'total': 25.00
        }
        
        response = orders.create_order(dummy_request)
        assert response['total'] == 25.00
        assert len(response['items']) == 1
    
    def test_create_order_insufficient_stock(self, dummy_request, dbsession):
        """Test creating an order with insufficient stock"""
        product = Product(title="Test Product", description="Test", price=10.00, stock=1)
        dbsession.add(product)
        dbsession.flush()
        
        dummy_request.json_body = {
            'customerInfo': {
                'fullName': 'John Doe',
                'email': 'john@example.com',
                'address': '123 Main St',
                'phoneNumber': '555-1234'
            },
            'items': [
                {
                    'id': product.id,
                    'quantity': 5  # More than available stock
                }
            ],
            'subtotal': 50.00,
            'total': 50.00
        }
        
        response = orders.create_order(dummy_request)
        assert response.status_code == 400
    
    def test_update_order_status_success(self, dummy_request, dbsession):
        """Test updating order status successfully"""
        # Create customer and order
        customer = CustomerInfo(
            full_name="John Doe",
            email="john@example.com",
            address="123 Main St",
            phone_number="555-1234"
        )
        dbsession.add(customer)
        dbsession.flush()
        
        order = Order(
            order_id="ORD-12345",
            customer_info_id=customer.id,
            subtotal=100.00,
            total=100.00,
            status="pending"
        )
        dbsession.add(order)
        dbsession.flush()
        
        dummy_request.matchdict = {'id': str(order.id)}
        dummy_request.json_body = {
            'status': 'completed',
            'note': 'Order completed successfully',
            'updatedBy': 'admin'
        }
        
        response = orders.update_order_status(dummy_request)
        assert response['status'] == 'completed'
    
    def test_cancel_order_restores_stock(self, dummy_request, dbsession):
        """Test that cancelling an order restores stock"""
        # Create product and customer
        product = Product(title="Test Product", description="Test", price=10.00, stock=5)
        customer = CustomerInfo(
            full_name="John Doe",
            email="john@example.com",
            address="123 Main St",
            phone_number="555-1234"
        )
        dbsession.add_all([product, customer])
        dbsession.flush()
        
        # Create order with order item
        order = Order(
            order_id="ORD-12345",
            customer_info_id=customer.id,
            subtotal=20.00,
            total=20.00,
            status="pending"
        )
        dbsession.add(order)
        dbsession.flush()
        
        order_item = OrderItem(
            order_id=order.id,
            product_id=product.id,
            quantity=2,
            price=10.00
        )
        dbsession.add(order_item)
        dbsession.flush()
        
        # Reduce stock as if order was created
        product.stock = 3  # 5 - 2 = 3
        
        # Cancel order
        dummy_request.matchdict = {'id': str(order.id)}
        dummy_request.json_body = {
            'status': 'cancelled',
            'note': 'Order cancelled'
        }
        
        orders.update_order_status(dummy_request)
        
        # Check that stock was restored
        assert product.stock == 5  # 3 + 2 = 5


# =============================================================================
# ADMIN VIEW TESTS
# =============================================================================

class TestAdminViews:
    def test_admin_login_success(self, dummy_request, dbsession):
        """Test successful admin login"""
        # Create admin
        test_admin = Admin(username="testadmin")
        test_admin.set_password("testpassword")
        test_admin.is_active = True
        dbsession.add(test_admin)
        dbsession.flush()
        
        dummy_request.json_body = {
            'username': 'testadmin',
            'password': 'testpassword'
        }
        
        response = admin.admin_login(dummy_request)
        assert 'token' in response
        assert response['admin']['username'] == 'testadmin'
    
    def test_admin_login_invalid_credentials(self, dummy_request, dbsession):
        """Test admin login with invalid credentials"""
        # Create admin
        test_admin = Admin(username="testadmin")
        test_admin.set_password("testpassword")
        dbsession.add(test_admin)
        dbsession.flush()
        
        dummy_request.json_body = {
            'username': 'testadmin',
            'password': 'wrongpassword'
        }
        
        response = admin.admin_login(dummy_request)
        assert response.status_code == 401
    
    def test_admin_login_inactive_account(self, dummy_request, dbsession):
        """Test admin login with inactive account"""
        # Create inactive admin
        test_admin = Admin(username="testadmin")
        test_admin.set_password("testpassword")
        test_admin.is_active = False
        dbsession.add(test_admin)
        dbsession.flush()
        
        dummy_request.json_body = {
            'username': 'testadmin',
            'password': 'testpassword'
        }
        
        response = admin.admin_login(dummy_request)
        assert response.status_code == 401
    
    def test_create_admin_success(self, dummy_request):
        """Test creating a new admin successfully"""
        dummy_request.json_body = {
            'username': 'newadmin',
            'password': 'newpassword'
        }
        
        response = admin.create_admin(dummy_request)
        assert response['admin']['username'] == 'newadmin'
    
    def test_create_admin_duplicate_username(self, dummy_request, dbsession):
        """Test creating admin with duplicate username"""
        # Create existing admin
        existing_admin = Admin(username="testadmin")
        existing_admin.set_password("password")
        dbsession.add(existing_admin)
        dbsession.flush()
        
        dummy_request.json_body = {
            'username': 'testadmin',  # Same username
            'password': 'newpassword'
        }
        
        response = admin.create_admin(dummy_request)
        assert response.status_code == 400
    
    @patch('product_api.views.admin.jwt.decode')
    def test_get_admin_profile_success(self, mock_jwt_decode, dummy_request, dbsession):
        """Test getting admin profile with valid token"""
        # Create admin
        test_admin = Admin(username="testadmin")
        test_admin.set_password("testpassword")
        dbsession.add(test_admin)
        dbsession.flush()
        
        # Mock JWT decode
        mock_jwt_decode.return_value = {'admin_id': test_admin.id}
        
        # Set authorization header
        dummy_request.headers = {'Authorization': 'Bearer valid_token'}
        
        response = admin.get_admin_profile(dummy_request)
        assert response['username'] == 'testadmin'
    
    def test_get_admin_profile_no_token(self, dummy_request):
        """Test getting admin profile without token"""
        dummy_request.headers = {}
        
        response = admin.get_admin_profile(dummy_request)
        assert response.status_code == 401


# =============================================================================
# INTEGRATION TESTS
# =============================================================================

class TestIntegration:
    def test_complete_order_flow(self, dummy_request, dbsession):
        """Test complete order flow from product creation to order completion"""
        # 1. Create product
        product = Product(title="Integration Product", description="Test", price=25.00, stock=10)
        dbsession.add(product)
        dbsession.flush()
        
        # 2. Create order
        dummy_request.json_body = {
            'customerInfo': {
                'fullName': 'Integration Test',
                'email': 'test@example.com',
                'address': '123 Test St',
                'phoneNumber': '555-0000'
            },
            'items': [
                {
                    'id': product.id,
                    'quantity': 3
                }
            ],
            'subtotal': 75.00,
            'shipping': 10.00,
            'total': 85.00
        }
        
        order_response = orders.create_order(dummy_request)
        assert order_response['total'] == 85.00
        
        # Verify stock was reduced
        dbsession.refresh(product)
        assert product.stock == 7  # 10 - 3 = 7
        
        # 3. Update order status
        order_id = order_response['id']
        dummy_request.matchdict = {'id': str(order_id)}
        dummy_request.json_body = {
            'status': 'shipped',
            'note': 'Order shipped via FedEx'
        }
        
        status_response = orders.update_order_status(dummy_request)
        assert status_response['status'] == 'shipped'
        assert len(status_response['statusHistory']) == 1
    
    def test_admin_authentication_flow(self, dummy_request, dbsession):
        """Test complete admin authentication flow"""
        # 1. Create admin
        dummy_request.json_body = {
            'username': 'flowadmin',
            'password': 'flowpassword'
        }
        
        create_response = admin.create_admin(dummy_request)
        assert create_response['admin']['username'] == 'flowadmin'
        
        # 2. Login
        login_response = admin.admin_login(dummy_request)
        assert 'token' in login_response
        
        # 3. Get profile with token
        token = login_response['token']
        dummy_request.headers = {'Authorization': f'Bearer {token}'}
        
        with patch('product_api.views.admin.jwt.decode') as mock_decode:
            admin_id = create_response['admin']['id']
            mock_decode.return_value = {'admin_id': admin_id}
            
            profile_response = admin.get_admin_profile(dummy_request)
            assert profile_response['username'] == 'flowadmin'


# =============================================================================
# UTILITY FUNCTIONS FOR TESTING
# =============================================================================

def create_test_product(dbsession, **kwargs):
    """Helper function to create test product"""
    defaults = {
        'title': 'Test Product',
        'description': 'Test Description',
        'price': 10.00,
        'stock': 5
    }
    defaults.update(kwargs)
    
    product = Product(**defaults)
    dbsession.add(product)
    dbsession.flush()
    return product

def create_test_customer(dbsession, **kwargs):
    """Helper function to create test customer"""
    defaults = {
        'full_name': 'Test Customer',
        'email': 'test@example.com',
        'address': '123 Test St',
        'phone_number': '555-0000'
    }
    defaults.update(kwargs)
    
    customer = CustomerInfo(**defaults)
    dbsession.add(customer)
    dbsession.flush()
    return customer

def create_test_admin(dbsession, **kwargs):
    """Helper function to create test admin"""
    defaults = {
        'username': 'testadmin',
        'password': 'testpassword'
    }
    defaults.update(kwargs)
    
    password = defaults.pop('password')
    admin_user = Admin(**defaults)
    admin_user.set_password(password)
    
    dbsession.add(admin_user)
    dbsession.flush()
    return admin_user


# =============================================================================
# RUN TESTS
# =============================================================================

if __name__ == "__main__":
    pytest.main([__file__, "-v"])