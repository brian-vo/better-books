from . import db
from sqlalchemy.ext.automap import automap_base
from sqlalchemy.sql import func


Base = automap_base()

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

    @classmethod
    def getTotal(self, order_id):
        isbns = db.session.query(Isbns).filter(Isbns.order_id == order_id)

        sum = 0 

        for isbn in isbns:
            book = db.session.query(Book).filter(Book.isbn == isbn.isbn).one()
            if(isbn.amount > 1):
                for x in range(isbn.amount):
                    sum+=book.price
            else:
                sum+=book.price

        return sum


class Customer(Base):
    __tablename__ = 'customer'

class Derived_From(Base):
    __tablename__ = 'derived_from'

class Genres(Base):
    __tablename__ = 'genres'

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

Base.prepare(db.engine, reflect=True)
