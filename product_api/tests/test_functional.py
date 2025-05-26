import pytest
from product_api.models.product import Product

def test_products_endpoint_success(testapp, dbsession):
    """Test that the products endpoint works correctly"""
    # Create a test product
    product = Product(
        title="Test Product",
        description="Test Description", 
        price=29.99,
        stock=10,
        image="test.jpg"
    )
    dbsession.add(product)
    dbsession.flush()

    # Test getting products
    res = testapp.get('/api/products', status=200)
    assert res.status_code == 200
    assert res.content_type == 'application/json'

def test_notfound(testapp):
    """Test 404 for non-existent endpoints"""
    res = testapp.get('/badurl', status=404)
    assert res.status_code == 404

def test_api_health_check(testapp):
    """Test basic API health check"""
    # Test that we can at least connect to some endpoint
    res = testapp.get('/api/products', status=200)
    assert res.status_code == 200