from pyramid.httpexceptions import HTTPOk
import logging

log = logging.getLogger(__name__)

def cors_headers(request):
    """Return CORS headers"""
    return {
        'Access-Control-Allow-Origin': 'http://localhost:3000',  # React app URL
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, Accept',
        'Access-Control-Max-Age': '86400',
        'Access-Control-Allow-Credentials': 'true'
    }

def add_cors_headers_response_callback(event):
    """Add CORS headers to all responses"""
    request = event.request
    response = event.response
    
    if response is not None:
        cors_headers_dict = cors_headers(request)
        for header, value in cors_headers_dict.items():
            response.headers[header] = value
        
        log.debug(f"Added CORS headers to response for {request.method} {request.path}")

def options_view(request):
    """Handle OPTIONS preflight requests"""
    log.info(f"Handling OPTIONS request for {request.path}")
    response = HTTPOk()
    
    # Add CORS headers
    cors_headers_dict = cors_headers(request)
    for header, value in cors_headers_dict.items():
        response.headers[header] = value
    
    # Set content type
    response.content_type = 'application/json'
    response.body = b'{"status": "ok"}'
    
    return response

def includeme(config):
    """Include CORS configuration"""
    # Add response callback for CORS headers
    config.add_subscriber(add_cors_headers_response_callback, 'pyramid.events.NewResponse')
    
    # Add OPTIONS route that catches all paths
    config.add_route('cors_options', '/*path', request_method='OPTIONS')
    config.add_view(options_view, route_name='cors_options', request_method='OPTIONS')
    
    log.info("CORS configuration included")