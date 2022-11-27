from flask import Blueprint, jsonify, request
from . import db
from .models import Book

from .models import Shopping_Cart
from .models import Derived_From
from .models import Stores

from .models import Wishlist
from .models import Includes

from .models import User
from .models import Customer
from .models import Admin
from .models import Book_Order

from .models import Recommendation
from .models import Sends
from .models import Author_Names
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

# return a specific book stock by isbn, specified in url
@main.route('/book/<book_isbn>/stock')
def book_stock(book_isbn):
    books = []
    exists = db.session.query(db.exists().where(Book.isbn == book_isbn)).scalar()

    if exists:
        isbn = {'isbn' : book_isbn}
        sql = text("SELECT * FROM book WHERE isbn = :isbn")
        book_list = db.session.execute(sql, isbn)
        for book in book_list:
            books.append({'stock' : book.stock})      

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

        status, value = add_item_cart(user_id)
        return status, value
    else:
        status, value = add_item_cart(user_id)
        return status, value

# adds item to stores relationship relative to cart
def add_item_cart(user_id):
    cart_data = request.get_json()
    cart = db.session.query(Shopping_Cart).filter(Shopping_Cart.user_id == user_id).one()

    item_exists_cart = db.session.query(db.exists().where(Stores.cart_id == cart.cart_id, Stores.isbn == cart_data['isbn'])).scalar()

    # if cart doesnt already store product, create stores
    if not item_exists_cart:
        new_stores = Stores(cart_id = cart.cart_id, isbn = cart_data['isbn'], amount = 1 )
        db.session.add(new_stores)
        
    # if cart does already contain, amount+=1
    else:
        current = db.session.query(Stores).filter(Stores.cart_id == cart.cart_id, Stores.isbn == cart_data['isbn']).one()
        current.amount+=1
    db.session.commit()

    return 'ADDED ISBN'  + cart_data['isbn'] + 'TO USER ' + user_id + ' CART', 200

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

        status, code = add_item_wishlist(user_id)
        return status, code
    else:
        status, code = add_item_wishlist(user_id)
        return status, code

# adds item to stores relationship relative to wishlist
def add_item_wishlist(user_id):
    wishlist_data = request.get_json()

    wishlist = db.session.query(Wishlist).filter(Wishlist.user_id == user_id).one()
    wishlist_exists = db.session.query(db.exists().where(Includes.wishlist_id == wishlist.wishlist_id, Includes.isbn == wishlist_data['isbn'])).scalar()

    if not wishlist_exists:
        new_stores = Includes(wishlist_id = wishlist.wishlist_id, isbn = wishlist_data['isbn'] )
        db.session.add(new_stores)
        db.session.commit()
        return 'Book ' + wishlist_data['isbn'] + ' added to wishlist', 200 
    else:
        return 'Book ' + wishlist_data['isbn'] + ' already exists in wishlist', 400 
    

# get existing wishlist data                                                                                                    
@main.route('/wishlist/<user_id>/data')
def wishlist_data(user_id):
    wishlist_exists = db.session.query(db.exists().where(Wishlist.user_id == user_id)).scalar()

    if wishlist_exists:
        wishlist = db.session.query(Wishlist).filter(Wishlist.user_id == user_id).one()
        all_includes = db.session.query(Includes).filter(Includes.wishlist_id == wishlist.wishlist_id)
        wishlist_items = []

        for items in all_includes:
            wishlist_items.append({'isbn' : items.isbn})        

        return jsonify({'wishlist_items' : wishlist_items})
    else:
        return 'USER DOES NOT HAVE A WISHLIST', 404

# delete book from wishlist
@main.route('/wishlist/<user_id>/delete_item', methods=['POST'])
def wishlist_delete_item(user_id):
    wishlist_exists = db.session.query(db.exists().where(Wishlist.user_id == user_id)).scalar()

    if wishlist_exists:
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

# ===========================================================
# review FUNCTIONS
# ===========================================================

# ===========================================================
# user FUNCTIONS
# ===========================================================

# add a user with data from flask HTTP method
@main.route('/register/new', methods=['POST'])
def add_user():
    user_data = request.get_json()

    exists = db.session.query(db.exists().where(User.email == user_data['email'])).scalar()

    if not exists:
        new_user = User(fname=user_data['fname'], lname=user_data['lname'], email=user_data['email'], pass_word=user_data['password'])
        db.session.add(new_user)
        db.session.commit()

        db.session.add(add_customer(user_data['email']))
        db.session.commit()

        return 'Registered new user', 201
    else:
        return 'User with this email already exists', 400

# add new user to customer relation
def add_customer(email):
     user = db.session.query(User).filter(User.email == email).one()
     return Customer(user_id = user.user_id)
     
# return a specific user by id, specified in url
@main.route('/<user_id>/data')
def user_data(user_id):
    exists = db.session.query(db.exists().where(User.user_id == user_id)).scalar()

    if exists:
        users = []
        id = {'user_id' : str(user_id)}
        sql = text("SELECT * FROM user WHERE user_id = :user_id")
        user_list = db.session.execute(sql, id)
        for user in user_list:
            users.append({'fname' : user.fname, 'lname' : user.lname, 'email' : user.email})      

        return jsonify({'user' : users})
  
    else:
        return 'User does not exist', 404

# return all orders from specific user_id
@main.route('/<user_id>/orders/')
def user_orders(user_id):
    exists = db.session.query(db.exists().where(User.user_id == user_id)).scalar()

    if exists:
        orders = []
        order_list = db.session.query(Book_Order).filter(Book_Order.user_id == user_id)
        for order in order_list:
            if order.prepared_date != None:
                order.prepared_date = order.prepared_date.strftime('%Y-%m-%d')
            if order.shipped_date != None:
                order.shipped_date = order.shipped_date.strftime('%Y-%m-%d')
            if order.delivered_date != None:
                order.delivered_date = order.delivered_date.strftime('%Y-%m-%d')
            orders.append({'order_id' : order.order_id, 'order_date' : order.order_date.strftime('%Y-%m-%d'), 'status' : order.STATUS, 'prepared_date' : order.prepared_date, 'shipping_date' : order.shipped_date, 'delivered_date' : order.delivered_date, 'payment_method' : order.payment_method})      

        return jsonify({'orders' : orders})
  
    else:
        return 'User does not exist', 404

# ===========================================================
# Recommendation FUNCTIONS
# ===========================================================

# add new recommendation
@main.route('/recommendation/new', methods=['POST'])
def add_recommendation():
    recommendation_data = request.get_json()

    new_recommendation = Recommendation(recipient_id=recommendation_data['recipient_id'], user_id=recommendation_data['user_id'])
    db.session.add(new_recommendation)
    db.session.commit()

    recommend = db.session.query(Recommendation).filter(Recommendation.recommend_id == new_recommendation.recommend_id).one()

    if(recommendation_data['isbns'] != None):
        for isbns in recommendation_data['isbns']:
            new_sends = Sends(recommend_id = recommend.recommend_id, isbn = isbns )
            db.session.add(new_sends)
            db.session.commit()
    if(recommendation_data['author_names'] != None):
        for authors in recommendation_data['author_names']:
            new_author = Author_Names(recommend_id = recommend.recommend_id, author_id = authors)
            db.session.add(new_author)
            db.session.commit()

    return 'Created New Recommendation', 201

# delete recommendation + associated tables
@main.route('/recommendation/delete', methods = ['POST'])
def recommend_delete():
    recommendation_data = request.get_json()
    recommendation_exists = db.session.query(db.exists().where(Recommendation.recommend_id == recommendation_data['recommend_id'])).scalar()

    if recommendation_exists:
        db.session.query(Sends).filter_by(recommend_id = recommendation_data['recommend_id']).delete()
        db.session.query(Author_Names).filter_by(recommend_id = recommendation_data['recommend_id']).delete()
        db.session.query(Recommendation).filter_by(recommend_id = recommendation_data['recommend_id']).delete()
        db.session.commit()
        
        return 'DELETED', 200
    else:
        return 'RECOMMENDATION DOES NOT EXIST', 404

# return all recommendation to specific user_id
@main.route('/recommendation/<user_id>/')
def recieved_recommendations(user_id):
    exists = db.session.query(db.exists().where(Recommendation.recipient_id == user_id)).scalar()

    if exists:
        recommendations = []
        recommendations_list = db.session.query(Recommendation).filter(Recommendation.recipient_id == user_id)
        for recommendation in recommendations_list:
            recommendations.append({'recommend_id' : recommendation.recommend_id, 'sender_id' : recommendation.user_id })      

        return jsonify({'recommendations' : recommendations})
  
    else:
        return 'User has no recommendations', 404

# get existing recommendation data                                                                                                    
@main.route('/recommendation/view/<recommend_id>')
def recommendation_data(user_id, recommend_id):
    recommendation_exists = db.session.query(db.exists().where(Recommendation.recommend_id == recommend_id)).scalar()

    if recommendation_exists:
        recommendation_info = []
        all_sends = db.session.query(Sends).filter(Sends.recommend_id == recommend_id)
        all_authors = db.session.query(Author_Names).filter(Author_Names.recommend_id == recommend_id)

        for send in all_sends:
            recommendation_info.append({'isbn' : send.isbn})       
        for author in  all_authors:
            recommendation_info.append({'author_ids' : author.author_id})       

        return jsonify({'wishlist_items' : recommendation_info})
    else:
        return 'RECOMMENDATION DOES NOT EXIST', 404

# ===========================================================
# customer FUNCTIONS
# ===========================================================

# return a specific user's points by id, specified in url
@main.route('/<user_id>/points/data')
def user_points_data(user_id):
    exists = db.session.query(db.exists().where(User.user_id == user_id)).scalar()

    if exists:
        users = []
        customer_list = db.session.query(Customer).filter(Customer.user_id == user_id).one()
        users.append({'points' : customer_list.loyalty_points})      

        return jsonify({'user' : users})
  
    else:
        return 'User does not exist', 404

# updates loyalty points
@main.route('/<user_id>/points/update', methods = ['POST'])
def update_points(user_id):
    points_data = request.get_json()
    customer_exists = db.session.query(db.exists().where(Customer.user_id == user_id)).scalar()


    # if customer exists, update points
    if customer_exists:
        customer = db.session.query(Customer).filter(Customer.user_id == user_id).one()
        customer.loyalty_points+=int(points_data['points'])
        db.session.commit()
        return 'UPDATED POINTS', 200
    # if customer does not exist
    else:
        return 'CUSTOMER DOES NOT EXIST', 404

# ===========================================================
# admin FUNCTIONS
# ===========================================================

# return a specific user's points by id, specified in url
@main.route('/<user_id>/admin')
def start_date(user_id):
    exists = db.session.query(db.exists().where(Admin.user_id == user_id)).scalar()

    if exists:
        admins = []
        admin = db.session.query(Admin).filter(Admin.user_id == user_id).one()
        admins.append({'start_date' : admin.Start_date.strftime('%Y-%m-%d')})      

        return jsonify({'admin' : admins})
  
    else:
        return 'Admin does not exist', 404