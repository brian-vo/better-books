from flask import Blueprint, jsonify, request
from . import db
from .models import Book

from .models import Shopping_Cart
from .models import Derived_From
from .models import Stores

from .models import Wishlist
from .models import Includes
from .models import User

from sqlalchemy.sql import text


main = Blueprint('main', __name__)

# ===========================================================
# BOOK FUNCTIONS
# ===========================================================

# return all books
@main.route('/book/all_data')
def books_all():
    book_list = db.session.query(Book).all()
    books = []

    for book in book_list:
        books.append({'isbn' : book.isbn, 'title' : book.title, 'description' : book.description, 'stock' : book.stock, 'price' : book.price})        

    return jsonify({'books' : books})

# return a specific book by isbn, specified in url
@main.route('/book/<book_isbn>/data')
def books_specific(book_isbn):
    books = []
    exists = db.session.query(db.exists().where(Book.isbn == book_isbn)).scalar()

    if exists:
        isbn = {'isbn' : book_isbn}
        sql = text("SELECT * FROM book WHERE isbn = :isbn")
        book_list = db.session.execute(sql, isbn)
        for book in book_list:
            books.append({'isbn' : book.isbn, 'title' : book.title, 'description' : book.description, 'stock' : book.stock, 'price' : book.price})      

        return jsonify({'books' : books})
  
    else:
        return 'Book does not exist', 404

# add a book with data from flask HTTP method
@main.route('/add_book/', methods=['POST'])
def add_book():
    book_data = request.get_json()

    exists = db.session.query(db.exists().where(Book.isbn == book_data['isbn'])).scalar()

    if not exists:
        new_book = Book(isbn=book_data['isbn'], title=book_data['title'], description=book_data['description'], stock=book_data['stock'], price=book_data['price'] )
        db.session.add(new_book)
        db.session.commit()

        return 'Done', 201
    else:
        return 'Book already exists', 400

# ===========================================================
# SHOPPING_CART FUNCTIONS
# ===========================================================

# add an item to shopping_cart - NOT SURE HOW TO HANDLE USER_ID yet
@main.route('/shopping_cart/add/<user_id>', methods=['POST'])
# checks if cart exists for that user, and creates if does not 
def add_cart(user_id):
    cart_exists = db.session.query(db.exists().where(Shopping_Cart.user_id == user_id)).scalar()

    if not cart_exists:
        new_cart = Shopping_Cart(user_id= user_id)
        db.session.add(new_cart)
        db.session.commit()

        add_item_cart(user_id)
        return 'Added', 200
    else:
        add_item_cart(user_id)
        return 'Added', 200

# adds item to stores relationship relative to cart
def add_item_cart(user_id):
    cart_data = request.get_json()

    cart = db.session.query(Shopping_Cart).filter(Shopping_Cart.user_id == user_id).one()
    new_stores = Stores(cart_id = cart.cart_id, isbn = cart_data['isbn'] )
    db.session.add(new_stores)
    db.session.commit()

    return ''

# get existing shopping cart data                                                                                                    UNFINISHED
@main.route('/shopping_cart/<user_id>/data')
def cart_data(user_id):
    cart_exists = db.session.query(db.exists().where(Shopping_Cart.user_id == user_id)).scalar()

    if cart_exists:
        cart = db.session.query(Shopping_Cart).filter(Shopping_Cart.user_id == user_id).one()
        sql = text("FROM shopping_cart AS c, stores AS s, book AS b WHERE c.cart_id = :cart AND :cart= s.cart_id AND s.isbn = b.isbn GROUP BY b.isbn")
        cart_list = db.session.execute(sql, cart.cart_id, cart.cart_id)

        return jsonify({'books' : cart_list})
    else:
        return 'NO CART', 404

# delete book from cart
@main.route('/shopping_cart/<user_id>/delete_item', methods=['POST'])
def cart_delete_item(user_id):
    cart_exists = db.session.query(db.exists().where(Shopping_Cart.user_id == user_id)).scalar()

    if cart_exists:
        cart_data = request.get_json()
        cart = db.session.query(Shopping_Cart).filter(Shopping_Cart.user_id == user_id).one()
        db.session.query(Stores).filter_by(cart_id = cart.cart_id, isbn = cart_data['isbn']).delete()
        db.session.commit()
        
        return 'DELETED', 200
    else:
        return 'NO CART', 404

# delete cart + associated stores
@main.route('/shopping_cart/<user_id>/delete')
def cart_delete(user_id):
    cart_exists = db.session.query(db.exists().where(Shopping_Cart.user_id == user_id)).scalar()


    if cart_exists:
        cart = db.session.query(Shopping_Cart).filter(Shopping_Cart.user_id == user_id).one()
        derived_exists = db.session.query(db.exists().where(Derived_From.cart_id == cart.user_id)).scalar()
        
        if derived_exists:
            db.session.query(Derived_From).filter_by(cart_id = cart.cart_id).delete()

        db.session.query(Stores).filter_by(cart_id = cart.cart_id).delete()
        db.session.query(Shopping_Cart).filter(Shopping_Cart.user_id == user_id).delete()
        db.session.commit()
        
        return 'DELETED', 200
    else:
        return 'NO CART', 404

# ===========================================================
# wishhlist FUNCTIONS
# ===========================================================

# add an item to wishlist - NOT SURE HOW TO HANDLE USER_ID yet
@main.route('/wishlist/add/<user_id>', methods=['POST'])
# checks if wishlist exists for that user, and creates if does not 
def add_wishlist(user_id):
    wishlist_exists = db.session.query(db.exists().where(Wishlist.user_id == user_id)).scalar()

    if not wishlist_exists:
        new_wishlist = Wishlist(user_id= user_id)
        db.session.add(new_wishlist)
        db.session.commit()

        add_item_wishlist(user_id)
        return 'Added', 200
    else:
        add_item_wishlist(user_id)
        return 'Added', 200

# adds item to stores relationship relative to wishlist
def add_item_wishlist(user_id):
    wishlist_data = request.get_json()

    wishlist = db.session.query(Wishlist).filter(Wishlist.user_id == user_id).one()
    wishlist_exists = db.session.query(db.exists().where(Includes.wishlist_id == wishlist.wishlist_id, Includes.isbn == wishlist_data['isbn'])).scalar()

    if not wishlist_exists:
        new_stores = Includes(wishlist_id = wishlist.wishlist_id, isbn = wishlist_data['isbn'] )
        db.session.add(new_stores)
        db.session.commit()
    else:
        print('failed')
    
    return ''

# get existing shopping cart data                                                                                                    UNFINISHED
@main.route('/wishlist/<user_id>/data')
def wishlist_data(user_id):
    wishlist_exists = db.session.query(db.exists().where(Wishlist.user_id == user_id)).scalar()

    if wishlist_exists:
        cart = db.session.query(Wishlist).filter(Wishlist.user_id == user_id).one()
        sql = text("FROM shopping_cart AS c, stores AS s, book AS b WHERE c.cart_id = :cart AND :cart= s.cart_id AND s.isbn = b.isbn GROUP BY b.isbn")
        cart_list = db.session.execute(sql, cart.cart_id, cart.cart_id)

        return jsonify({'books' : cart_list})
    else:
        return 'NO CART', 404

# delete book from wishlist
@main.route('/wishlist/<user_id>/delete_item', methods=['POST'])
def wishlist_delete_item(user_id):
    wishlist_exists = db.session.query(db.exists().where(Wishlist.user_id == user_id)).scalar()

    if wishlist_exists:
        wishlist_data = request.get_json()
        wishlist = db.session.query(Wishlist).filter(Wishlist.user_id == user_id).one()
        db.session.query(Wishlist).filter_by(wishlist_id = wishlist.wishlist_id, isbn = wishlist_data['isbn']).delete()
        db.session.commit()
        
        return 'DELETED', 200
    else:
        return 'NO CART', 404

# delete wishlist + associated stores
@main.route('/wishlist/<user_id>/delete')
def wishlist_delete(user_id):
    wishlist_exists = db.session.query(db.exists().where(Wishlist.user_id == user_id)).scalar()

    if wishlist_exists:
        wishlist = db.session.query(Wishlist).filter(Wishlist.user_id == user_id).one()

        db.session.query(Includes).filter_by(wishlist_id = wishlist.wishlist_id).delete()
        db.session.query(Wishlist).filter_by(user_id = wishlist.user_id).delete()
        db.session.commit()
        
        return 'DELETED', 200
    else:
        return 'NO CART', 404