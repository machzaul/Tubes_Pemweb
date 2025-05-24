def includeme(config):
    config.add_static_view('static', 'static', cache_max_age=3600)
    config.add_route('home', '/')
    
    # Product routes
    config.add_route('products', '/api/products')
    config.add_route('product', '/api/products/{id}')
    
    # Customer Info routes
    config.add_route('customer_info_list', '/api/customers')
    config.add_route('customer_info', '/api/customers/{id}')
    
    # Order routes
    config.add_route('orders', '/api/orders')
    config.add_route('order', '/api/orders/{id}')
    config.add_route('order_status', '/api/orders/{id}/status')
    
    # Admin routes
    config.add_route('admin_login', '/api/admin/login')
    config.add_route('admin_logout', '/api/admin/logout')
    config.add_route('admin_create', '/api/admin/create')
    config.add_route('admin_profile', '/api/admin/profile')