def includeme(config):
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('home', '/')
    
    # Product routes
    config.add_route('products', '/api/products')
    config.add_route('product', '/api/products/{id}')