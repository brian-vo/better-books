from . import db
from sqlalchemy.ext.automap import automap_base

Base = automap_base()
Base.prepare(db.engine, reflect=True)



class Admin(Base):
    __tablename__ = 'admin'

class Author(Base):
    __tablename__ = 'author'

class Author_Names(Base):
    __tablename__ = 'author_names'

class Book(Base):
    __tablename__ = 'book'

class Book_Order(Base):
    __tablename__ = 'book_order'

class Customer(Base):
    __tablename__ = 'customer'

class Derived_From(Base):
    __tablename__ = 'derived_from'

class Genres(Base):
    __tablename__ = 'Genres'

class Includes(Base):
    __tablename__ = 'includes'

class Isbns(Base):
    __tablename__ = 'isbns'

class Recommendation(Base):
     __tablename__ = 'recommendation'

class Review(Base):
     __tablename__ = 'review'

class Sends(Base):
     __tablename__ = 'sends'

class Shopping_Cart(Base):
     __tablename__ = 'shopping_cart'

class Stores(Base):
     __tablename__ = 'stores'

class User(Base):
    __tablename__ = 'user'

class Wishlist(Base):
     __tablename__ = 'wishlist'

class Writes(Base):
     __tablename__ = 'writes'

