""" Global pytest configuration and fixtures """
import pytest
import os
import sys
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from pyramid import testing
from pyramid.testing import DummyRequest

# Add the project root to Python path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from product_api.models.meta import Base
from product_api.models.product import Product
from product_api.models.customer_info import CustomerInfo
from product_api.models.order import Order, OrderItem
from product_api.models.admin import Admin

@pytest.fixture(scope="session")
def engine():
    """Create test database engine"""
    # Use in-memory SQLite for testing
    return create_engine('sqlite:///:memory:', echo=False)

@pytest.fixture(scope="session")
def tables(engine):
    """Create all tables for testing"""
    Base.metadata.create_all(engine)
    yield
    Base.metadata.drop_all(engine)

@pytest.fixture
def dbsession(engine, tables):
    """Create a fresh database session for each test"""
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
    """Create a dummy request with database session"""
    request = DummyRequest()
    request.dbsession = dbsession
    request.json_body = {}
    request.headers = {}
    request.matchdict = {}
    return request

# Test data factories
@pytest.fixture
def sample_product(dbsession):
    """Create a sample product for testing"""
    product = Product(
        title="Sample Product",
        description="Sample product for testing",
        price=29.99,
        stock=10,
        image="sample.jpg"
    )
    dbsession.add(product)
    dbsession.flush()
    return product

@pytest.fixture
def sample_customer(dbsession):
    """Create a sample customer for testing"""
    customer = CustomerInfo(
        full_name="John Doe",
        email="john.doe@example.com",
        address="123 Main Street, City, State 12345",
        phone_number="555-123-4567"
    )
    dbsession.add(customer)
    dbsession.flush()
    return customer

@pytest.fixture
def sample_admin(dbsession):
    """Create a sample admin for testing"""
    admin = Admin(username="testadmin")
    admin.set_password("testpassword123")
    admin.is_active = True
    dbsession.add(admin)
    dbsession.flush()
    return admin

@pytest.fixture
def sample_order(dbsession, sample_customer, sample_product):
    """Create a sample order for testing"""
    order = Order(
        order_id="ORD-TEST-001",
        customer_info_id=sample_customer.id,
        subtotal=29.99,
        shipping=5.00,
        total=34.99,
        status="pending",
        status_history=[]
    )
    dbsession.add(order)
    dbsession.flush()
    
    # Add order item
    order_item = OrderItem(
        order_id=order.id,
        product_id=sample_product.id,
        quantity=1,
        price=29.99
    )
    dbsession.add(order_item)
    dbsession.flush()
    
    return order

# Utility fixtures
@pytest.fixture
def multiple_products(dbsession):
    """Create multiple products for testing"""
    products = []
    for i in range(5):
        product = Product(
            title=f"Product {i+1}",
            description=f"Description for product {i+1}",
            price=10.00 + (i * 5),
            stock=10 - i,
            image=f"product{i+1}.jpg"
        )
        products.append(product)
    
    dbsession.add_all(products)
    dbsession.flush()
    return products

@pytest.fixture
def jwt_secret():
    """JWT secret for testing"""
    return "test-secret-key-for-jwt-tokens"

import pytest
from pyramid import testing
from pyramid.testing import DummyRequest
from webtest import TestApp

@pytest.fixture
def dummy_request(dbsession):
    """Create a complete dummy request with all needed attributes"""
    request = DummyRequest()
    request.dbsession = dbsession
    request.json_body = {}
    request.headers = {}
    request.matchdict = {}
    
    # Tambahkan attributes yang missing
    request.content_type = 'application/json'
    request.method = 'GET'
    request.path = '/'
    request.url = 'http://localhost/'
    request.remote_addr = '127.0.0.1'
    
    return request

@pytest.fixture
def testapp(config, dbsession):
    """Create WebTest TestApp for functional testing"""
    from product_api import main
    
    # Setup basic config
    settings = {
        'sqlalchemy.url': 'sqlite:///:memory:',
    }
    
    app = main({}, **settings)
    app.registry.dbsession = dbsession
    
    return TestApp(app)

@pytest.fixture  
def app_request(dbsession):
    """Create app request for view testing"""
    config = testing.setUp()
    request = testing.DummyRequest()
    request.dbsession = dbsession
    request.json_body = {}
    request.headers = {}
    request.matchdict = {}
    request.content_type = 'application/json'
    
    return request