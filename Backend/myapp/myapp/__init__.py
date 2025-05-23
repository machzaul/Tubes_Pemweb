from pyramid.config import Configurator
from pyramid.authentication import BasicAuthAuthenticationPolicy
from pyramid.authorization import ACLAuthorizationPolicy
from sqlalchemy import engine_from_config
from .models import DBSession, Base

def check(username, password, request):
    return username == 'admin' and password == 'adminpass'


config = Configurator(
    settings=settings,
    authentication_policy=BasicAuthAuthenticationPolicy(check),
    authorization_policy=ACLAuthorizationPolicy(),
)

def main(global_config, **settings):
    engine = engine_from_config(settings, 'sqlalchemy.')
    DBSession.configure(bind=engine)
    Base.metadata.bind = engine

    with Configurator(settings=settings) as config:
        config.include('pyramid_jinja2')
        config.include('.models')
        config.include('.routes')  # <- ini penting!
        config.scan('myapp.views')  # <- ini penting juga!

        return config.make_wsgi_app()

