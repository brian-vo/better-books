from . import db
from sqlalchemy.ext.automap import automap_base

Base = automap_base()


class User(Base):
        __tablename__ = 'user'

Base.prepare(db.engine, reflect=True)

admin = Base.classes.admin
author = Base.classes.author
author_names = Base.classes.author_names
book = Base.classes.book
book_order = Base.classes.book_order
customer = Base.classes.customer
derived_from = Base.classes.derived_from
genres = Base.classes.genres
includes = Base.classes.includes
isbns = Base.classes.isbns
recommendation = Base.classes.recommendation
review =    Base.classes.review
sends = Base.classes.sends
shopping_cart = Base.classes.shopping_cart
stores = Base.classes.stores
wishlist = Base.classes.wishlist
writes = Base.classes.writes

