
def includeme(config):
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('home', '/')
    
    # Product routes
    config.add_route('products', '/api/products')
    config.add_route('product_detail', '/api/products/{id}')
    config.add_route('product_create', '/api/products/create')
    config.add_route('product_update', '/api/products/{id}/update')
    config.add_route('product_delete', '/api/products/{id}/delete')