from pyramid.httpexceptions import HTTPOk

def cors_headers(request):
    """Return CORS headers"""
    return {
        'Access-Control-Allow-Origin': 'http://localhost:3000',  # React app URL
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '86400'
    }

def add_cors_headers_response_callback(event):
    """Add CORS headers to all responses"""
    request = event.request
    response = event.response
    
    if response is not None:
        response.headers.update(cors_headers(request))

def options_view(request):
    """Handle OPTIONS preflight requests"""
    response = HTTPOk()
    response.headers.update(cors_headers(request))
    return response

def includeme(config):
    """Include CORS configuration"""
    config.add_subscriber(add_cors_headers_response_callback, 'pyramid.events.NewResponse')
    config.add_view(options_view, route_name='cors_options', request_method='OPTIONS')