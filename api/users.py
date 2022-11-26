from flask import Blueprint, jsonify, request
from . import db
from .models import Book
from .models import Shopping_Cart
from .models import Stores
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
    exists = db.session.query(db.exists().where(Shopping_Cart.user_id == user_id)).scalar()

    if not exists:
        new_cart = Shopping_Cart(user_id= user_id)
        db.session.add(new_cart)
        db.session.commit()

        add_item(user_id)
        return 'Added', 200
    else:
        add_item(user_id)
        return 'Added', 200

# adds item to stores relationship relative to cart
def add_item(user_id):
    cart_data = request.get_json()

    cart = db.session.query(Shopping_Cart).filter(user_id == user_id).first()
    new_stores = Stores(cart_id = cart.cart_id, isbn = cart_data['isbn'] )
    db.session.add(new_stores)
    db.session.commit()

    return ''

# get existing shopping cart data
@main.route('/shopping_cart/<user_id>/data')
def cart_data(user_id):
    exists = db.session.query(db.exists().where(Shopping_Cart.user_id == user_id)).scalar()

    if exists:
        cart = db.session.query(Shopping_Cart).filter(user_id == user_id).first()
        sql = text("FROM shopping_cart AS c, stores AS s, book AS b WHERE c.cart_id = :cart AND :cart= s.cart_id AND s.isbn = b.isbn GROUP BY b.isbn")
        cart_list = db.session.execute(sql, cart.cart_id, cart.cart_id)

        return jsonify({'books' : cart_list})
    else:
        return 'NO CART', 404

# delete book from cart
@main.route('/shopping_cart/<user_id>/delete_item', methods=['POST'])
def cart_delete_item(user_id):
    exists = db.session.query(db.exists().where(Shopping_Cart.user_id == user_id)).scalar()

    if exists:
        cart_data = request.get_json()
        cart = db.session.query(Shopping_Cart).filter(user_id == user_id).first()
        db.session.query(Stores).filter_by(cart_id = cart.cart_id, isbn = cart_data['isbn']).delete()
        db.session.commit()
        
        return 'DELETED', 200
    else:
        return 'NO CART', 404

# delete cart + associated stores
@main.route('/shopping_cart/<user_id>/delete')
def cart_delete(user_id):
    exists = db.session.query(db.exists().where(Shopping_Cart.user_id == user_id)).scalar()

    if exists:
        cart = db.session.query(Shopping_Cart).filter(user_id == user_id).first()
        db.session.query(Stores).filter_by(cart_id = cart.cart_id).delete()
        db.session.query(Shopping_Cart).filter(user_id == user_id).delete()
        db.session.commit()
        
        return 'DELETED', 200
    else:
        return 'NO CART', 404