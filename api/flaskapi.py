from flask import Blueprint, jsonify, request, session, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, login_required, logout_user, current_user
from flask_principal import Principal, Identity, AnonymousIdentity, identity_changed, Principal, Permission, RoleNeed
from .models import *
from flask_jwt_extended import create_access_token
from flask_cors import cross_origin
import re
from . import db

main = Blueprint('main', __name__)

# define the admin_permission decorator using flask_principal
admin_permission = Permission(RoleNeed('admin'))

# sanitize inputs
def sanitize_input(input_str: str) -> str:
    # Sanitize the input string
    sanitized = re.sub('[^A-Za-z0-9\s_]+', '_', input_str)

    # Return the sanitized string
    return sanitized

# sanitize email inputs - only allow for inputs in str@str.str format
def sanitize_input_email(input_str: str) -> str:
    # Sanitize the input string
    sanitized = re.sub('/^[^\s@]+@[^\s@]+\.[^\s@]+$/', '_', input_str)

    # Return the sanitized string
    return sanitized

# ===========================================================
# BOOK FUNCTIONS
# ===========================================================

# return all books 
@main.route('/book/all_data')
def books_all():
    # query sql database for all books
    book_list = db.session.query(Book).all()
    books = []
    # iterate through all books,  appending info into an list
    for book in book_list:
        authors = []
        # query sql database for all authors that wrote the book
        book_writes = db.session.query(Writes).filter(Writes.isbn == book.isbn)
        for auth in book_writes:
            # query sql database for author info
            author = db.session.query(Author).filter(Author.author_id == auth.author_id).one()
            # append respective book author's info into an temporary 'author' list
            authors.append({'fname' : author.fname, 'lname' : author.lname})
        # append all book info into a list, including author data
        books.append({'isbn' : book.isbn, 'title' : book.title, 'description' : book.description, 'stock' : book.stock, 'price' : book.price, 'authors' : authors, 'image_location' : book.image_location, 'average_rating' : book.getAverageRating(book.isbn)})        

    # return list as a json object
    return jsonify({'books' : books})

# return data of specific book by isbn as json objec, specified in url
@main.route('/book/<book_isbn>/data')
def books_specific(book_isbn):
    book_isbn = sanitize_input(book_isbn)
    books = []
    # check if book exists
    exists = db.session.query(db.exists().where(Book.isbn == book_isbn)).scalar()

    if exists:
        # query sql database for book
        book = db.session.query(Book).filter(Book.isbn == book_isbn).one()
        
        authors = []
        # query sql database for all authors that wrote the book
        book_writes = db.session.query(Writes).filter(Writes.isbn == book.isbn).one()
        # query sql database for author info
        author = db.session.query(Author).filter(Author.author_id == book_writes.author_id).one()

        # append respective book author's info into an temporary 'author' list, and append with rest of data to books list
        authors.append({'fname' : author.fname, 'lname' : author.lname})
        books.append({'isbn' : book.isbn, 'title' : book.title, 'description' : book.description, 'stock' : book.stock, 'price' : book.price, 'authors' : authors, 'image_location' : book.image_location, 'average_rating' : book.getAverageRating(book.isbn), 'number_reviews' : book.getNumberReviews(book.isbn)})          

        # return book data stored in list as json object
        return jsonify({'books' : books})
  
    else:
        return 'Book does not exist', 404

# add a book with data from flask HTTP method, requires admin role to call
@main.route('/book/new', methods=['POST'])
@login_required
@admin_permission.require()
def add_book():
    book_isbn = sanitize_input(book_isbn)
    book_data = request.get_json()

    # check if book already exists
    exists = db.session.query(db.exists().where(Book.isbn == book_data['isbn'])).scalar()

    if not exists:
        # add book to database
        new_book = Book(isbn=book_data['isbn'], title=book_data['title'], description=book_data['description'], stock=book_data['stock'], price=book_data['price'], cover_type=book_data['cover_type'])
        db.session.add(new_book)
        db.session.commit()

        return 'Done', 201
    else:
        return 'Book already exists', 400

# ===========================================================
# SHOPPING_CART FUNCTIONS
# ===========================================================

# add an item to shopping_cart, checks if cart exists for that user, and creates if does not exist. Requires login
@main.route('/shopping_cart/add/', methods=['POST'])
@cross_origin()
@login_required
def add_cart():
    user_id = current_user.user_id
    cart_exists = db.session.query(db.exists().where(Shopping_Cart.user_id == user_id)).scalar()

    # if cart does not exist, create new cart for user
    if not cart_exists:
        new_cart = Shopping_Cart(user_id= user_id)
        db.session.add(new_cart)
        db.session.commit()

    # call add_item_cart function to add requested items to cart
    status, value = add_item_cart(user_id)
    return status, value

# adds item to stores relationship/ updates quantity if already exists in cart
def add_item_cart(user_id):
    cart_data = request.get_json()
    cart = db.session.query(Shopping_Cart).filter(Shopping_Cart.user_id == user_id).one()
    isbn = sanitize_input(cart_data['isbn'])
    # check if cart already contains product
    item_exists_cart = db.session.query(db.exists().where(Stores.cart_id == cart.cart_id, Stores.isbn == isbn)).scalar()

    # if cart doesnt already store product, create stores
    if not item_exists_cart:
        new_stores = Stores(cart_id = cart.cart_id, isbn = isbn, amount = 1 )
        db.session.add(new_stores)
        
    # if cart does already contain, amount+=1
    else:
        current = db.session.query(Stores).filter(Stores.cart_id == cart.cart_id, Stores.isbn == isbn).one()
        book = db.session.query(Book).filter(Book.isbn == isbn).one()
        if current.amount+1 > book.stock:
            return 'Unable to add product to cart, not enough stock', 307
        current.amount+=1
    db.session.commit()

    return 'ADDED ISBN'  + str(isbn) + ' TO USER ' + str(user_id) + ' CART', 200

# get existing shopping cart data, requires login                                                                                                    
@main.route('/shopping_cart/data/')
@login_required
def cart_data():
    user_id = current_user.user_id
    cart_exists = db.session.query(db.exists().where(Shopping_Cart.user_id == user_id)).scalar()

    if cart_exists:
        cart_list = []
        items = []
        # query sql database for cart
        cart = db.session.query(Shopping_Cart).filter(Shopping_Cart.user_id == user_id).one()

        # query sql database for all items in cart
        items_order = db.session.query(Stores).filter(Stores.cart_id == cart.cart_id)
        # iterate through items in cart, appending to temporary list 'items'
        for item in items_order:
            book = db.session.query(Book).filter(Book.isbn == item.isbn).one()
            items.append({'isbn' : item.isbn, 'title' : book.title, 'isbn' : book.isbn, 'price' : book.price, 'quantity' : item.amount, 'image_location' : book.image_location})

        total = cart.getTotal(cart.cart_id)
        cart_list.append({'sum' : total, 'items' : items})
        # return book data stored in list as json object
        return jsonify({'books' : cart_list})
    else:
        return 'NO CART', 404

# update quantity of item in cart to any number, requires login
@main.route('/shopping_cart/update/', methods=['POST'])
@cross_origin()
@login_required
def cart_update_item():
    user_id = current_user.user_id
    cart_data = request.get_json()
    quantity = sanitize_input(cart_data['quantity'])
    cart_exists = db.session.query(db.exists().where(Shopping_Cart.user_id == user_id)).scalar()

    # if cart exists, call add_to_cart function
    if cart_exists:
        add_to_cart(user_id, quantity)

# update item quantity in stores relationship
def add_to_cart(user_id, quantity):
    cart_data = request.get_json()
    isbn = sanitize_input(cart_data['isbn'])
    # select cart
    cart = db.session.query(Shopping_Cart).filter(Shopping_Cart.user_id == user_id).one()
    # select stores relationship
    current = db.session.query(Stores).filter(Stores.cart_id == cart.cart_id, Stores.isbn == isbn).one()
    # update quantity
    current.amount = quantity
    db.session.commit()


# delete indiviudal book from cart, requires login
@main.route('/shopping_cart/delete/', methods=['POST'])
@cross_origin()
@login_required
def cart_delete_item():
    user_id = current_user.user_id
    cart_exists = db.session.query(db.exists().where(Shopping_Cart.user_id == user_id)).scalar()

    if cart_exists:
        cart_data = request.get_json()
        isbn = sanitize_input(cart_data['isbn'])
        # select cart, delete stores relationship storing requested isbn
        cart = db.session.query(Shopping_Cart).filter(Shopping_Cart.user_id == user_id).one()
        db.session.query(Stores).filter(Stores.cart_id == cart.cart_id, Stores.isbn == isbn).delete()
        db.session.commit()
        
        return 'DELETED', 200
    else:
        return 'NO CART', 404


# delete cart + associated stores, requires login
@main.route('/shopping_cart/delete/all')
@cross_origin()
@login_required
def cart_delete():
    user_id = current_user.user_id
    cart_exists = db.session.query(db.exists().where(Shopping_Cart.user_id == user_id)).scalar()
    # if cart exists, delete cart and associated stores
    if cart_exists:
        # query sql database for cart, and if derived from exists
        cart = db.session.query(Shopping_Cart).filter(Shopping_Cart.user_id == user_id).one()
        derived_exists = db.session.query(db.exists().where(Derived_From.cart_id == cart.user_id)).scalar()
        
        if derived_exists:
            # delete derived from relationship (used for connecting an order to a cart, ERD diagram clarity)
            db.session.query(Derived_From).filter_by(cart_id = cart.cart_id).delete()

        db.session.query(Stores).filter_by(cart_id = cart.cart_id).delete()
        db.session.query(Shopping_Cart).filter(Shopping_Cart.user_id == user_id).delete()
        db.session.commit()
        
        return 'DELETED', 200
    else:
        return 'NO CART', 404
# ===========================================================
# book_order FUNCTIONS
# ===========================================================

# create new order, requires login
@main.route('/order/create/', methods=['POST'])
@login_required
def new_order():
    # get order data, sanitize inputs
    user_id = current_user.user_id
    order_data = request.get_json()
    shipping_address = sanitize_input(order_data['shipping_address'])
    payment_method = sanitize_input(order_data['payment_method'])

    # create new order
    new_order = Book_Order(user_id=user_id, shipping_address=shipping_address, payment_method=payment_method)
    db.session.add(new_order)
    db.session.commit()
    # select user's cart
    cart = db.session.query(Shopping_Cart).filter(Shopping_Cart.user_id == user_id).one()

    # create new derived_from to link cart / order temporarily
    new_deriv_from = Derived_From(cart_id = cart.cart_id, order_id = new_order.order_id)
    db.session.add(new_deriv_from)
    # select all items in cart
    cart_items = db.session.query(Stores).filter(Stores.cart_id == cart.cart_id).all()
    # store each item in cart in Isbns table, for order
    for items in cart_items:
        new_isbns = Isbns(order_id = new_order.order_id, isbn = items.isbn, amount = items.amount)
        book = db.session.query(Book).filter(Book.isbn == items.isbn).one()
        # update book stock
        book.stock -= items.amount
        db.session.add(new_isbns)
    
    # update user loyalty points by 10x the total price of the order
    sum = cart.getTotal(cart.cart_id)
    sum = round(sum * 10)
    customer = db.session.query(Customer).filter(Customer.user_id == user_id).one()
    customer.loyalty_points += sum
    
    db.session.commit()

    return 'ORDER CREATED', 200


# return data of single order
@main.route('/order/<order_id>/data')
@login_required
def order_data(order_id):
    order_id = sanitize_input(order_id)
    exists = db.session.query(db.exists().where(Book_Order.order_id == order_id)).scalar()

    if exists:
        # select requested order
        order = db.session.query(Book_Order).filter(Book_Order.order_id == order_id).one()
        # if user is admin or order was created by requesting user, return order data
        if(order.user_id == current_user.user_id or current_user.role_value == "admin"):
            orders = []
            items = []
            items_qty = []
            items_order = db.session.query(Isbns).filter(Isbns.order_id == order_id)
            # store each item in order in items list
            for item in items_order:
                items.append(item.isbn)
                t = (item.isbn, item.amount)
                items_qty.append(t)
            sum = order.getTotal(order.order_id)
            # format dates
            if order.prepared_date != None:
                order.prepared_date = order.prepared_date.strftime('%Y-%m-%d')
            if order.shipped_date != None:
                order.shipped_date = order.shipped_date.strftime('%Y-%m-%d')
            if order.delivered_date != None:
                order.delivered_date = order.delivered_date.strftime('%Y-%m-%d')
            # store order data in orders list
            orders.append({'order_id' : order.order_id, 'order_date' : order.order_date.strftime('%Y-%m-%d'), 'status' : order.STATUS, 'prepared_date' : order.prepared_date, 'shipping_date' : order.shipped_date, 'delivered_date' : order.delivered_date, 'payment_method' : order.payment_method, 'sum' : sum, 'items' : items, 'items_qty' : items_qty, 'address' : order.shipping_address})      
    
            # return order data stored in list as json object
            return jsonify({'order' : orders})
        else:
            # else if user does not have permission to view order, return error
            return 'NOT PERMITTED', 404
    else:
        return 'Order does not exist', 404

# ===========================================================
# wishhlist FUNCTIONS
# ===========================================================

# add an item to wishlist, checks if wishlist exists and creates if it does not. Requires login
@main.route('/wishlist/add/', methods=['POST'])
@cross_origin()
@login_required
def add_wishlist():
    user_id = current_user.user_id

    wishlist_exists = db.session.query(db.exists().where(Wishlist.user_id == user_id)).scalar()
    # if wishlist does not exist, create new wishlist
    if not wishlist_exists:
        new_wishlist = Wishlist(user_id= user_id)
        db.session.add(new_wishlist)
        db.session.commit()

    # add item to wishlist
    status, code = add_item_wishlist(user_id)
    return status, code

# adds item to Includes relationship to store items in wishlist
def add_item_wishlist(user_id):
    wishlist_data = request.get_json()
    isbn = sanitize_input(wishlist_data['isbn'])
    # check if book already exists in wishlist
    wishlist = db.session.query(Wishlist).filter(Wishlist.user_id == user_id).one()
    wishlist_exists = db.session.query(db.exists().where(Includes.wishlist_id == wishlist.wishlist_id, Includes.isbn == isbn)).scalar()

    if not wishlist_exists:
        # add book to wishlist
        new_stores = Includes(wishlist_id = wishlist.wishlist_id, isbn = isbn )
        db.session.add(new_stores)
        db.session.commit()
        return 'Book ' + str(isbn) + ' added to wishlist', 200 
    else:
        # if book already exists in wishlist, return error
        return 'Book ' + str(isbn) + ' already exists in wishlist', 400 
    

# get existing wishlist data of own user, requires login                                                                                               
@main.route('/wishlist/data')
@cross_origin()
@login_required
def wishlist_data():
    user_id = current_user.user_id
    wishlist_exists = db.session.query(db.exists().where(Wishlist.user_id == user_id)).scalar()

    if wishlist_exists:
        # get wishlist data
        wishlist = db.session.query(Wishlist).filter(Wishlist.user_id == user_id).one()
        all_includes = db.session.query(Includes).filter(Includes.wishlist_id == wishlist.wishlist_id)
        wishlist_items = []
        # iterate through wishlist items and store in list
        for items in all_includes:
            wishlist_items.append({'isbn' : items.isbn})        
        # return wishlist data as json object
        return jsonify({'wishlist_items' : wishlist_items})
    else:
        return 'USER DOES NOT HAVE A WISHLIST', 404

# delete a book from wishlist of own user, requires login
@main.route('/wishlist/delete_item', methods=['POST'])
@cross_origin()
@login_required
def wishlist_delete_item():
    user_id = current_user.user_id
    wishlist_exists = db.session.query(db.exists().where(Wishlist.user_id == user_id)).scalar()
    
    if wishlist_exists:
        wishlist_data = request.get_json()
        isbn = sanitize_input(wishlist_data['isbn'])
        # query sql database to select wishlist, and respective Includes relationship, and deletes selected item
        wishlist = db.session.query(Wishlist).filter(Wishlist.user_id == user_id).one()
        db.session.query(Includes).filter(Includes.wishlist_id == wishlist.wishlist_id, Includes.isbn == isbn).delete()
        db.session.commit()
        
        return 'DELETED', 200
    else:
        return 'NO CART', 404

# ===========================================================
# review FUNCTIONS
# ===========================================================

# add a review to a book, requires login
@main.route('/book/<isbn>/review/new', methods=['POST'])
@cross_origin()
@login_required
def add_review(isbn):
    user_id = current_user.user_id
    review_data = request.get_json()
    exists = db.session.query(db.exists().where(Review.user_id == current_user.user_id, Review.isbn == isbn )).scalar()

    # check if user has already reviewed this book
    if not exists:
        message_title = sanitize_input(review_data['message_title'])
        message_body = sanitize_input(review_data['message_body'])
        rating = sanitize_input(review_data['rating'])

        # add review to database
        new_review = Review(user_id=user_id, isbn=isbn, message_title=message_title, message_body=message_body, rating=rating)
        db.session.add(new_review)
        db.session.commit()

        return 'Review Created', 201
    else:
        # if user has already reviewed this book, return error
        return 'User already has review on this product', 400

# return all reviews created by requesting user, requires login
@main.route('/reviews/all')
@cross_origin()
@login_required
def all_review():
    user_id = current_user.user_id
    exists = db.session.query(db.exists().where(Review.user_id == user_id)).scalar()

    # check if user has any reviews
    if exists:
        reviews = []
        reviews_list = db.session.query(Review).filter(Review.user_id == user_id)
        # iterate through reviews and store in list
        for review in reviews_list:
            reviews.append({'isbn' : review.isbn, 'message_title' : review.message_title, 'message_body' : review.message_body, 'post_date' : review.post_date.strftime('%Y-%m-%d'), 'rating' : review.rating })      
        # return reviews as json object
        return jsonify({'reviews' : reviews})
  
    else:
        # if user has no reviews, return error
        return 'User has no reviews', 404

# return all reviews created on isbn
@main.route('/book/<isbn>/review_all')
@cross_origin()
def all_review_book(isbn):
    isbn = sanitize_input(isbn)
    exists = db.session.query(db.exists().where(Review.isbn == isbn)).scalar()

    # check if book has any reviews
    if exists:
        reviews = []
        reviews_list = db.session.query(Review).filter(Review.isbn == isbn)
        # iterate through reviews and store in list
        for review in reviews_list:
            reviews.append({'user_id' : review.user_id, 'message_title' : review.message_title, 'message_body' : review.message_body, 'post_date' : review.post_date.strftime('%Y-%m-%d'), 'rating' : review.rating })      
        # return reviews as json object
        return jsonify({'reviews' : reviews})
  
    else:
        # if book has no reviews, return error
        return 'Book has no reviews', 404

# return data of a review by a specific user on a specific book
@main.route('/book/<isbn>/review/<user_id>')
def specific_review(isbn, user_id):
    isbn = sanitize_input(isbn)
    user_id = sanitize_input(user_id)
    exists = db.session.query(db.exists().where(Review.isbn == isbn, Review.user_id == user_id )).scalar()

    # check if such a review exists
    if exists:
        reviews = []
        reviews_list = db.session.query(Review).filter(Review.isbn == isbn, Review.user_id == user_id)
        # iterate through reviews and store in list
        for review in reviews_list:
            reviews.append({'user_id' : user_id, 'isbn' : isbn, 'message_title' : review.message_title, 'message_body' : review.message_body, 'post_date' : review.post_date.strftime('%Y-%m-%d'), 'rating' : review.rating })      
        # return reviews as json object
        return jsonify({'reviews' : reviews})
  
    else:
        return 'This review does not exist', 404

# delete review, requires login
@main.route('/book/<isbn>/review/delete')
@cross_origin()
@login_required
def review_delete(isbn):
    isbn = sanitize_input(isbn)
    user_id = current_user.user_id
    exists = db.session.query(db.exists().where(Review.isbn == isbn, Review.user_id == user_id )).scalar()
    # check if review exists and is created by requesting user
    if exists:
        # delete review
        db.session.query(Review).filter(Review.isbn == isbn, Review.user_id == user_id).delete()
        db.session.commit()
        
        return 'DELETED', 200
    else:
        return 'Review does not exist', 404

# ===========================================================
# user FUNCTIONS
# ===========================================================

# add a user to the database
@main.route('/register/new', methods=['POST'])
def add_user():
    user_data = request.get_json()
    email = sanitize_input_email(user_data['email'])
    exists = db.session.query(db.exists().where(User.email == email)).scalar()

    # check if a user already exists with same email
    if not exists:
        fname = sanitize_input(user_data['fname'])
        lname = sanitize_input(user_data['lname'])
        # add user to database
        new_user = User(fname=fname, lname=lname, email=email,  role_value="customer", pass_word=generate_password_hash(user_data['pass_word'], method='sha256'))
        db.session.add(new_user)
        db.session.commit()

        # add user to customer relation by calling add_customer function
        db.session.add(add_customer(email))
        db.session.commit()

        return 'Registered new user', 201
    else:
        return 'User with this email already exists', 409

# add new user to customer relation
def add_customer(email):
     user = db.session.query(User).filter(User.email == email).one()
     return Customer(user_id = user.user_id)
     
# return own user info, for display in input box
@main.route('/user/data/self')
@login_required
def user_data_self():
    user_id = current_user.user_id
    exists = db.session.query(db.exists().where(User.user_id == user_id)).scalar()

    # check if user exists
    if exists:
        users = []
        # get user info and append to list
        user_list = db.session.query(User).filter(User.user_id == user_id).one()
        users.append({'fname' : user_list.fname, 'lname' : user_list.lname, 'email' : user_list.email})      
        # return user info as json object
        return jsonify({'user' : users})
  
    else:
        return 'User does not exist', 404

# return a specific user data by id, requires admin permission
@main.route('/user/data/<user_id>')
@login_required
@admin_permission.require()
def user_data(user_id):
    user_id = sanitize_input(user_id)
    exists = db.session.query(db.exists().where(User.user_id == user_id)).scalar()

    # check if user exists
    if exists:
        users = []
        user_list = db.session.query(User).filter(User.user_id == user_id).one()
        # append user info to list
        users.append({'fname' : user_list.fname, 'lname' : user_list.lname, 'email' : user_list.email})      
        # return user info as json object
        return jsonify({'user' : users})
  
    else:
        return 'User does not exist', 404

# login user, by checking if user exists and password is correct
@main.route('/login', methods = ['POST'])
def log_in():
    user_data = request.get_json()
    email = sanitize_input_email(user_data['email'])
    user = db.session.query(User).filter(User.email == email).one()
    # if user does not exist, or password hash does not match, return error
    if not user or not check_password_hash(user.pass_word, user_data['pass_word']):
        return 'Incorrect username or password', 401
    else:
        # login user
        login_user(user)
        identity_changed.send(current_app._get_current_object(), identity=Identity(user.user_id))
        # create access token
        access_token = create_access_token(identity=user.user_id)
        # return access token
        return jsonify(access_token=access_token), 200

# logout user
@main.route('/logout')
@login_required
def logout():
    logout_user()
    # clear session
    for key in ('identity.name', 'identity.auth_type'):
        session.pop(key, None)
    # clear identity
    identity_changed.send(current_app._get_current_object(), identity=AnonymousIdentity())
    return 'LOGGED OUT', 200

# return all orders created by requesting user
@main.route('/orders/all')
@login_required
def user_orders():
    user_id = current_user.user_id

    exists = db.session.query(db.exists().where(User.user_id == user_id)).scalar()
    # check if user exists
    if exists:
        orders = []
        # get all orders created by user
        order_list = db.session.query(Book_Order).filter(Book_Order.user_id == user_id)
        # iterate through orders and append to list
        for order in order_list:
            sum = order.getTotal(order.order_id)
            # format dates
            if order.prepared_date != None:
                order.prepared_date = order.prepared_date.strftime('%Y-%m-%d')
            if order.shipped_date != None:
                order.shipped_date = order.shipped_date.strftime('%Y-%m-%d')
            if order.delivered_date != None:
                order.delivered_date = order.delivered_date.strftime('%Y-%m-%d')
            # append order info to list
            orders.append({'order_id' : order.order_id, 'order_date' : order.order_date.strftime('%Y-%m-%d'), 'status' : order.STATUS, 'prepared_date' : order.prepared_date, 'shipping_date' : order.shipped_date, 'delivered_date' : order.delivered_date, 'payment_method' : order.payment_method, 'sum' : sum})      
        # return order info as json object
        return jsonify({'orders' : orders})
  
    else:
        return 'User does not exist', 404

# update user data, requires login
@main.route('/user/data/update', methods=['POST'])
@cross_origin()
@login_required
def update_order():
    user_id = current_user.user_id
    update_data = request.get_json()
    # get current user info
    user  = db.session.query(User).filter(User.user_id == user_id).one()
    fname = user.fname
    lname = user.lname
    email = user.email
    password = user.pass_word
    # check if passed user data is null, if so then do not change current data
    if (update_data['fname'] != None):
        fname = sanitize_input(update_data['fname'])
    if (update_data['lname'] != None):
        lname = sanitize_input(update_data['lname'])
    if (update_data['email'] != None):
        email = sanitize_input_email(update_data['email'])
    if (update_data['pass_word'] != None):
        # hash password
        password = update_data['pass_word']
        user.pass_word = generate_password_hash(password, method='sha256')

    # update user info, and commit to database
    user.fname = fname
    user.lname = lname
    user.email = email
    db.session.commit()

    return 'UPDATED USER', 201

# return current user roles, requires login
@main.route('/api/roles')
@cross_origin()
@login_required
def get_roles():
  roles = current_user.role_value
  return jsonify({'roles': roles})

# ===========================================================
# Recommendation FUNCTIONS
# ===========================================================

# add new recommendation
@main.route('/recommendation/new', methods=['POST'])
@login_required
def add_recommendation():
    user_id = current_user.user_id
    recommendation_data = request.get_json()
    recipient_id = sanitize_input(recommendation_data['recipient_id'])
    user_exists = db.session.query(db.exists().where(User.user_id == recipient_id)).scalar()
    if not user_exists:
        return "bad", 491
    new_recommendation = Recommendation(recipient_id=recipient_id, user_id=user_id)
    db.session.add(new_recommendation)
    db.session.commit()

    recommend = db.session.query(Recommendation).filter(Recommendation.recommend_id == new_recommendation.recommend_id).one()

    if(recommendation_data['isbns'] != None):
        for isbns in recommendation_data['isbns']:
            isbn_exist = db.session.query(db.exists().where(Book.isbn == isbns)).scalar()
            if not isbn_exist:
                db.session.query(Recommendation).filter(Recommendation.recommend_id == new_recommendation.recommend_id).delete()                
                db.session.commit()         
                return "bad", 492
            isbns = sanitize_input(isbns)
            new_sends = Sends(recommend_id = new_recommendation.recommend_id, isbn = isbns )
            db.session.add(new_sends)
            db.session.commit()
    if(recommendation_data['author_names'] != None):
        for authors in recommendation_data['author_names']:
            author_exist = db.session.query(db.exists().where(Author.author_id == authors)).scalar()
            if not author_exist:
                db.session.query(Recommendation).filter(Recommendation.recommend_id == new_recommendation.recommend_id).delete()                
                db.session.commit()         
                return "bad", 493
            authors = sanitize_input(authors)
            new_author = Author_Names(recommend_id = new_recommendation.recommend_id, author_id = authors)
            db.session.add(new_author)
            db.session.commit()

    return 'Created New Recommendation', 201

# delete recommendation + associated tables
@main.route('/recommendation/delete', methods = ['POST'])
@login_required
def recommend_delete():
    user_id = current_user.user_id
    recommendation_data = request.get_json()
    recommendation_id = sanitize_input(recommendation_data['recommend_id'])
    recommendation_exists = db.session.query(db.exists().where(Recommendation.recommend_id == recommendation_id)).scalar()

    if recommendation_exists:
        Recommendation = db.session.qury(Recommendation).filter(Recommendation.recommend_id == recommendation_id).one()
        if (Recommendation.user_id == user_id):
            db.session.query(Sends).filter_by(recommend_id = recommendation_id).delete()
            db.session.query(Author_Names).filter_by(recommend_id = recommendation_id).delete()
            db.session.query(Recommendation).filter_by(recommend_id = recommendation_id).delete()
            db.session.commit()
        else:
            return 'NOT PERMITTED', 401
        return 'DELETED', 200
    else:
        return 'RECOMMENDATION DOES NOT EXIST', 404

# return all recommendation to specific user_id
@main.route('/recommendation/user/all/')
@cross_origin()
@login_required
def recieved_recommendations():
    user_id = current_user.user_id
    exists = db.session.query(db.exists().where(Recommendation.recipient_id == user_id)).scalar()

    if exists:
        recommendations = []
        recommendations_list = db.session.query(Recommendation).filter(Recommendation.recipient_id == user_id)
        for recommendation in recommendations_list:
            recommendations.append({'recommend_id' : recommendation.recommend_id, 'sender_id' : recommendation.user_id })      

        return jsonify({'recommendations' : recommendations})
  
    else:
        return 'User has no recommendations', 404

# return all recommendation to specific user_id
@main.route('/recommendation/user/all/sent')
@cross_origin()
@login_required
def sent_recommendations():
    user_id = current_user.user_id
    exists = db.session.query(db.exists().where(Recommendation.user_id == user_id)).scalar()

    if exists:
        recommendations = []
        recommendations_list = db.session.query(Recommendation).filter(Recommendation.user_id == user_id)
        for recommendation in recommendations_list:
            recommendations.append({'recommend_id' : recommendation.recommend_id, 'recipient_id' : recommendation.recipient_id })      

        return jsonify({'recommendations' : recommendations})
  
    else:
        return 'User has no recommendations', 404

# get existing recommendation data                                                                                                    
@main.route('/recommendation/view/<recommend_id>')
@cross_origin()
@login_required
def recommendation_data(recommend_id):
    recommend_id = sanitize_input(recommend_id)
    recommendation_exists = db.session.query(db.exists().where(Recommendation.recommend_id == recommend_id)).scalar()
    recommendation_exists = (
        db.session.query(db.exists().where(Recommendation.recommend_id == recommend_id))
        .scalar()
    )

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

# auto-give recommendations, based on wishlist                                                                                                    
@main.route('/recommendation/auto')
@cross_origin()
@login_required
def recommend_auto():
    user_id = current_user.user_id
    wishlist_exists = db.session.query(db.exists().where(Wishlist.user_id == user_id)).scalar()

    if wishlist_exists:
        wishlist = db.session.query(Wishlist).filter(Wishlist.user_id == user_id).one()
        includes_exists = db.session.query(db.exists().where(Includes.wishlist_id == wishlist.wishlist_id)).scalar()
        if includes_exists:
            genres = []
            books_gen = []
            book_ret = []
            wishlist = db.session.query(Wishlist).filter(Wishlist.user_id == user_id).one()
            includes = db.session.query(Includes).filter(Includes.wishlist_id == wishlist.wishlist_id).all()

            for books in includes:
                book = db.session.query(Book).filter(Book.isbn == books.isbn).one()
                genre = db.session.query(Genres).filter(Genres.isbn == book.isbn).one()
                genres.append(genre)
            
            for genre in genres:
                recommend_genre = db.session.query(Genres).filter(Genres.genre == genre.genre)
                for books in recommend_genre:
                    book = db.session.query(Book).filter(Book.isbn == books.isbn).one()
                    books_gen.append(book)
        
            for book in books_gen:
                authors = []
                book_writes = db.session.query(Writes).filter(Writes.isbn == book.isbn)
                for auth in book_writes:
                    author = db.session.query(Author).filter(Author.author_id == auth.author_id).one()
                    authors.append({'fname' : author.fname, 'lname' : author.lname})
                book_ret.append({'isbn' : book.isbn, 'title' : book.title, 'description' : book.description, 'stock' : book.stock, 'price' : book.price, 'authors' : authors, 'image_location' : book.image_location, 'average_rating' : book.getAverageRating(book.isbn)})          
            return jsonify({'wishlist_items' : book_ret})
        else:
            return 'No recommendations avaliable at this time', 481
    else:
        return 'No recommendations avaliable at this time', 481

# ===========================================================
# customer FUNCTIONS
# ===========================================================

# return current  user's points
@main.route('/user/points/')
@login_required
def user_points_data():
    user_id = current_user.user_id
    exists = db.session.query(db.exists().where(User.user_id == user_id)).scalar()

    if exists:
        users = []
        customer_list = db.session.query(Customer).filter(Customer.user_id == user_id).one()
        users.append({'points' : customer_list.loyalty_points})      

        return jsonify({'user' : users})
  
    else:
        return 'User does not exist', 404

# updates loyalty points
@main.route('/points/<user_id>/update', methods = ['POST'])
@login_required
@admin_permission.require()
def update_points(user_id):
    points_data = request.get_json()
    user_id = sanitize_input(user_id)
    points = sanitize_input(points_data['points'])

    customer_exists = db.session.query(db.exists().where(Customer.user_id == user_id)).scalar()
    
    # if customer exists, update points
    if customer_exists:
        customer = db.session.query(Customer).filter(Customer.user_id == user_id).one()
        customer.loyalty_points+=int(points)
        db.session.commit()
        return 'UPDATED POINTS', 200
    # if customer does not exist
    else:
        return 'CUSTOMER DOES NOT EXIST', 404


# ===========================================================
# admin FUNCTIONS
# ===========================================================

# return a specific admin start date
@main.route('/admin/<user_id>')
@login_required
@admin_permission.require()
def start_date(user_id):
    user_id = sanitize_input(user_id)
    exists = (
        db.session.query(db.exists().where(Admin.user_id == user_id))
        .scalar()
    )
    if exists:
        admins = []
        admin = db.session.query(Admin).filter(Admin.user_id == user_id).one()
        admins.append({'start_date' : admin.Start_date.strftime('%Y-%m-%d')})      

        return jsonify({'admin' : admins})
  
    else:
        return 'Admin does not exist', 404

# return all orders
@main.route('/admin/orders/all')
@login_required
@admin_permission.require()
def all_orders():
        orders = []
        order_list = db.session.query(Book_Order).all()
        for order in order_list:
            sum = order.getTotal(order.order_id)
            if order.prepared_date != None:
                order.prepared_date = order.prepared_date.strftime('%Y-%m-%d')
            if order.shipped_date != None:
                order.shipped_date = order.shipped_date.strftime('%Y-%m-%d')
            if order.delivered_date != None:
                order.delivered_date = order.delivered_date.strftime('%Y-%m-%d')
            orders.append({'order_id' : order.order_id, 'order_date' : order.order_date.strftime('%Y-%m-%d'), 'status' : order.STATUS, 'prepared_date' : order.prepared_date, 'shipping_date' : order.shipped_date, 'delivered_date' : order.delivered_date, 'payment_method' : order.payment_method, 'sum' : sum})      

        return jsonify({'orders' : orders})
  
  
# return all reviews
@main.route('/admin/reviews/all')
@cross_origin()
@login_required
@admin_permission.require()
def all_admin_review():
        reviews = []
        reviews_list = db.session.query(Review)
        for review in reviews_list:
            reviews.append({'user_id' : review.user_id, 'isbn' : review.isbn, 'message_title' : review.message_title, 'message_body' : review.message_body, 'post_date' : review.post_date.strftime('%Y-%m-%d'), 'rating' : review.rating })      

        return jsonify({'reviews' : reviews})

# delete review
@main.route('/admin/review/<isbn>/<user_id>/delete')
@cross_origin()
@login_required
def review_delete_admin(isbn, user_id):
        isbn = sanitize_input(isbn)
        user_id = sanitize_input(user_id)
        query = (
        db.session.query(Review)
        .filter(Review.isbn == isbn)
        .filter(Review.user_id == user_id)
        )

        query = query.params(isbn=isbn, user_id=user_id)

        query.delete()
        db.session.commit()
        
# ===========================================================
# search FUNCTIONS
# ===========================================================

@main.route('/search/', methods = ['POST'])
@cross_origin()
def search():
    data = request.get_json()
    search_input = data['search']
    search_input = sanitize_input(search_input)
    authors = []
    
    books = []
    sim_auth_fname = (
        db.session.query(Author)
        .filter(Author.fname.ilike(f'%{search_input}%'))
        .all()
    )

    sim_auth_lname = (
        db.session.query(Author)
        .filter(Author.lname.ilike(f'%{search_input}%'))
        .all()
    )

    sim_auth = list(dict.fromkeys(sim_auth_fname + sim_auth_lname))
    for authors in sim_auth:
        written_author = db.session.query(Writes).filter(Writes.author_id == authors.author_id)
        for written in written_author:
            book = db.session.query(Book).filter(Book.isbn == written.isbn).one()
            books.append({'isbn' : book.isbn, 'title' : book.title, 'description' : book.description, 'stock' : book.stock, 'price' : book.price, 'cover_type' : book.cover_type, 'image_location' : book.image_location, 'average_rating' : book.getAverageRating(book.isbn)})      


    book_list_title = db.session.query(Book).filter(Book.title.ilike(f'%{search_input}%')).all()

    for book in book_list_title:
        books.append({'isbn' : book.isbn, 'title' : book.title, 'description' : book.description, 'stock' : book.stock, 'price' : book.price, 'cover_type' : book.cover_type, 'image_location' : book.image_location, 'average_rating' : book.getAverageRating(book.isbn)})      

    book_no_dup = []
    [book_no_dup.append(x) for x in books if x not in book_no_dup]


    return jsonify({'books' : book_no_dup})
  
