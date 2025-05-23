from pyramid.paster import get_appsettings, setup_logging
from pyramid.scripts.common import parse_vars
from product_api.models.meta import Base
from product_api.models import get_engine, get_session_factory, get_tm_session, Product
import transaction
import sys
import os

def usage(argv):
    cmd = os.path.basename(argv[0])
    print('usage: %s <config_uri> [var=value]\n'
          '(example: "%s development.ini")' % (cmd, cmd))
    sys.exit(1)

def main(argv=sys.argv):
    if len(argv) < 2:
        usage(argv)
    config_uri = argv[1]
    options = parse_vars(argv[2:])
    setup_logging(config_uri)
    settings = get_appsettings(config_uri, options=options)

    engine = get_engine(settings)
    session_factory = get_session_factory(engine)

    with transaction.manager:
        dbsession = get_tm_session(session_factory, transaction.manager)
        
        # Check if product already exists
        existing_product = dbsession.query(Product).filter(Product.id == 2).first()
        if not existing_product:
            product = Product(
                id=2,
                title="Smart Watch",
                description="Track your fitness and receive notifications on the go",
                price=199.99,
                stock=10,
                image="https://fakestoreapi.com/img/71li-ujtlUL._AC_UX679_.jpg"
            )
            dbsession.add(product)
            print("Sample product added successfully!")
        else:
            print("Product already exists!")

if __name__ == '__main__':
    main()