from pyramid.security import Allow, Everyone

class RootFactory:
    __acl__ = [
        (Allow, 'admin', 'view')
    ]
    def __init__(self, request):
        pass
