import argparse
import sys

from pyramid.paster import bootstrap, setup_logging
from sqlalchemy.exc import OperationalError


def populate_db(dbsession):
    from ..models.product import Product  # Sesuaikan lokasi modelmu
    dbsession.add(Product(name='Sample Product', price=10000))


def parse_args(argv):
    parser = argparse.ArgumentParser()
    parser.add_argument('config_uri', help='Path to ini config file (e.g., development.ini)')
    return parser.parse_args(argv[1:])


def main(argv=sys.argv):
    args = parse_args(argv)
    setup_logging(args.config_uri)
    env = bootstrap(args.config_uri)

    try:
        with env['request'].tm:
            dbsession = env['request'].dbsession
            populate_db(dbsession)
            print("✅ Database berhasil diisi data awal.")
    except OperationalError:
        print("""
❌ Tidak bisa terhubung ke database.

Periksa kemungkinan berikut:
1. PostgreSQL belum berjalan?
2. Password/username di development.ini salah?
3. Database 'machzualmart_db' belum dibuat?

Silakan periksa dan coba lagi.
""")
