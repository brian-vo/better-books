from flask import Blueprint, jsonify, request, session, current_app
from . import db
from werkzeug.security import generate_password_hash, check_password_hash
from flask_login import login_user, login_required, logout_user, current_user
from flask_principal import Principal, Identity, AnonymousIdentity, identity_changed, Principal, Permission, RoleNeed
from .models import *
from flask_jwt_extended import create_access_token
from flask_cors import cross_origin

main = Blueprint('main', __name__)
admin_permission = Permission(RoleNeed('admin'))

# ===========================================================
# BOOK FUNCTIONS
# ===========================================================

# return all books 
@main.route('/book/all_data')
def books_all():
    book_list = db.session.query(Book).all()
    books = []
    for book in book_list:
        authors = []
        book_writes = db.session.query(Writes).filter(Writes.isbn == book.isbn)
        for auth in book_writes:
            author = db.session.query(Author).filter(Author.author_id == auth.author_id).one()
            authors.append({'fname' : author.fname, 'lname' : author.lname})
        books.append({'isbn' : book.isbn, 'title' : book.title, 'description' : book.description, 'stock' : book.stock, 'price' : book.price, 'authors' : authors, 'image_location' : book.image_location, 'average_rating' : book.getAverageRating(book.isbn)})        

    return jsonify({'books' : books})

# return a specific book by isbn, specified in url
@main.route('/book/<book_isbn>/data')
def books_specific(book_isbn):
    books = []
    exists = db.session.query(db.exists().where(Book.isbn == book_isbn)).scalar()

    if exists:
        book_list = db.session.query(Book).filter(Book.isbn == book_isbn)
        for book in book_list:
            authors = []
            book_writes = db.session.query(Writes).filter(Writes.isbn == book.isbn)
            for auth in book_writes:
                author = db.session.query(Author).filter(Author.author_id == auth.author_id).one()
                authors.append({'fname' : author.fname, 'lname' : author.lname})
        books.append({'isbn' : book.isbn, 'title' : book.title, 'description' : book.description, 'stock' : book.stock, 'price' : book.price, 'authors' : authors, 'image_location' : book.image_location, 'average_rating' : book.getAverageRating(book.isbn)})          

        return jsonify({'books' : books})
  
    else:
        return 'Book does not exist', 404

# return a specific book stock by isbn, specified in url
@main.route('/book/<book_isbn>/stock')
def book_stock(book_isbn):
    books = []
    exists = db.session.query(db.exists().where(Book.isbn == book_isbn)).scalar()

    if exists:
        book_list = db.session.query(Book).filter(Book.isbn == book_isbn)
        for book in book_list:
            books.append({'stock' : book.stock})      

        return jsonify({'books' : books})
  
    else:
        return 'Book does not exist', 404

# add a book with data from flask HTTP method
@main.route('/book/new', methods=['POST'])
@login_required
@admin_permission.require()
def add_book():
    book_data = request.get_json()

    exists = db.session.query(db.exists().where(Book.isbn == book_data['isbn'])).scalar()

    if not exists:
        new_book = Book(isbn=book_data['isbn'], title=book_data['title'], description=book_data['description'], stock=book_data['stock'], price=book_data['price'], cover_type=book_data['cover_type'])
        db.session.add(new_book)
        db.session.commit()

        return 'Done', 201
    else:
        return 'Book already exists', 400

# ===========================================================
# SHOPPING_CART FUNCTIONS
# ===========================================================

# add an item to shopping_cart
@main.route('/shopping_cart/add/', methods=['POST'])
@cross_origin()
@login_required
# checks if cart exists for that user, and creates if does not 
def add_cart():
    user_id = current_user.user_id
    cart_exists = db.session.query(db.exists().where(Shopping_Cart.user_id == user_id)).scalar()

    if not cart_exists:
        new_cart = Shopping_Cart(user_id= user_id)
        db.session.add(new_cart)
        db.session.commit()

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
        book = db.session.query(Book).filter(Book.isbn == cart_data['isbn']).one()
        if current.amount+1 > book.stock:
            return 'Unable to add product to cart, not enough stock', 307
        current.amount+=1
    db.session.commit()

    return 'ADDED ISBN'  + str(cart_data['isbn']) + ' TO USER ' + str(user_id) + ' CART', 200

# get existing shopping cart data                                                                                                    
@main.route('/shopping_cart/data/')
@login_required
def cart_data():
    user_id = current_user.user_id
    cart_exists = db.session.query(db.exists().where(Shopping_Cart.user_id == user_id)).scalar()

    if cart_exists:
        cart_list = []
        items = []
        cart = db.session.query(Shopping_Cart).filter(Shopping_Cart.user_id == user_id).one()

        items_order = db.session.query(Stores).filter(Stores.cart_id == cart.cart_id)
        for item in items_order:
            book = db.session.query(Book).filter(Book.isbn == item.isbn).one()
            items.append({'isbn' : item.isbn, 'title' : book.title, 'isbn' : book.isbn, 'price' : book.price, 'quantity' : item.amount, 'image_location' : book.image_location})

        total = cart.getTotal(cart.cart_id)
        cart_list.append({'sum' : total, 'items' : items})

        return jsonify({'books' : cart_list})
    else:
        return 'NO CART', 404

# update quantity
@main.route('/shopping_cart/update/', methods=['POST'])
@cross_origin()
@login_required
def cart_update_item():
    user_id = current_user.user_id
    cart_data = request.get_json()
    cart_exists = db.session.query(db.exists().where(Shopping_Cart.user_id == user_id)).scalar()

    if cart_exists:
        quantity  = cart_data['quantity']
        add_to_cart(user_id, quantity)

# adds item to stores relationship relative to cart
def add_to_cart(user_id, quantity):
    cart_data = request.get_json()
    cart = db.session.query(Shopping_Cart).filter(Shopping_Cart.user_id == user_id).one()

    current = db.session.query(Stores).filter(Stores.cart_id == cart.cart_id, Stores.isbn == cart_data['isbn']).one()
    current.amount = quantity
    db.session.commit()


# delete book from cart
@main.route('/shopping_cart/delete/', methods=['POST'])
@cross_origin()
@login_required
def cart_delete_item():
    user_id = current_user.user_id
    cart_exists = db.session.query(db.exists().where(Shopping_Cart.user_id == user_id)).scalar()

    if cart_exists:
        cart_data = request.get_json()
        cart = db.session.query(Shopping_Cart).filter(Shopping_Cart.user_id == user_id).one()
        stores = db.session.query(Stores).filter(Stores.cart_id == cart.cart_id, Stores.isbn == cart_data['isbn']).delete()
        db.session.commit()
        
        return 'DELETED', 200
    else:
        return 'NO CART', 404


# delete cart + associated stores
@main.route('/shopping_cart/delete/all')
@login_required
def cart_delete():
    user_id = current_user.user_id
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
# book_order FUNCTIONS
# ===========================================================

# create a new order -
@main.route('/order/create/', methods=['POST'])
@login_required
def new_order():
    user_id = current_user.user_id
    order_data = request.get_json()

    new_order = Book_Order(user_id=user_id, shipping_address=order_data['shipping_address'], payment_method=order_data['payment_method'])
    db.session.add(new_order)
    db.session.commit()
    cart = db.session.query(Shopping_Cart).filter(Shopping_Cart.user_id == user_id).one()

    new_deriv_from = Derived_From(cart_id = cart.cart_id, order_id = new_order.order_id)
    db.session.add(new_deriv_from)

    cart_items = db.session.query(Stores).filter(Stores.cart_id == cart.cart_id).all()
    for items in cart_items:
        new_isbns = Isbns(order_id = new_order.order_id, isbn = items.isbn, amount = items.amount)
        book = db.session.query(Book).filter(Book.isbn == items.isbn).one()
        book.stock -= items.amount
        db.session.add(new_isbns)
    db.session.commit()

    return 'ORDER CREATED', 200


# return data of single order
@main.route('/order/<order_id>/data')
@login_required
def order_data(order_id):
    exists = db.session.query(db.exists().where(Book_Order.order_id == order_id)).scalar()
    
    if exists:
        order = db.session.query(Book_Order).filter(Book_Order.order_id == order_id).one()
        if(order.user_id == current_user.user_id):
            orders = []
            items = []
            items_order = db.session.query(Isbns).filter(Isbns.order_id == order_id)
            for item in items_order:
                items.append(item.isbn)
            sum = order.getTotal(order.order_id)
            if order.prepared_date != None:
                order.prepared_date = order.prepared_date.strftime('%Y-%m-%d')
            if order.shipped_date != None:
                order.shipped_date = order.shipped_date.strftime('%Y-%m-%d')
            if order.delivered_date != None:
                order.delivered_date = order.delivered_date.strftime('%Y-%m-%d')
            orders.append({'order_id' : order.order_id, 'order_date' : order.order_date.strftime('%Y-%m-%d'), 'status' : order.STATUS, 'prepared_date' : order.prepared_date, 'shipping_date' : order.shipped_date, 'delivered_date' : order.delivered_date, 'payment_method' : order.payment_method, 'sum' : sum, 'items' : items})      
    

            return jsonify({'order' : orders})
        else:
            return 'NOT PERMITTED', 404
    else:
        return 'Order does not exist', 404

# ===========================================================
# wishhlist FUNCTIONS
# ===========================================================

# add an item to wishlist 
@main.route('/wishlist/add/', methods=['POST'])
@cross_origin()
@login_required
# checks if wishlist exists for that user, and creates if does not 
def add_wishlist():
    user_id = current_user.user_id

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
@main.route('/wishlist/data')
@cross_origin()
@login_required
def wishlist_data():
    user_id = current_user.user_id
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
@main.route('/wishlist/delete_item', methods=['POST'])
@cross_origin()
@login_required
def wishlist_delete_item():
    user_id = current_user.user_id
    wishlist_exists = db.session.query(db.exists().where(Wishlist.user_id == user_id)).scalar()
    if wishlist_exists:
        wishlist_data = request.get_json()
        wishlist = db.session.query(Wishlist).filter(Wishlist.user_id == user_id).one()
        db.session.query(Includes).filter(Includes.wishlist_id == wishlist.wishlist_id, Includes.isbn == wishlist_data['isbn']).delete()
        db.session.commit()
        
        return 'DELETED', 200
    else:
        return 'NO CART', 404

# delete wishlist + associated stores
@main.route('/wishlist/delete')
@login_required
def wishlist_delete(user_id):
    user_id = current_user.user_id
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

# add a review with data from flask HTTP method
@main.route('/book/<isbn>/review/new', methods=['POST'])
@cross_origin()
@login_required
def add_review(isbn):
    user_id = current_user.user_id
    review_data = request.get_json()
    exists = db.session.query(db.exists().where(Review.user_id == current_user.user_id, Review.isbn == isbn )).scalar()

    if not exists:
        new_review = Review(user_id=user_id, isbn=isbn, message_title=review_data['message_title'], message_body=review_data['message_body'], rating=review_data['rating'])
        db.session.add(new_review)
        db.session.commit()

        return 'Done', 201
    else:
        return 'User already has review on this product', 400

# return all reviews created by user_id
@main.route('/reviews/all')
@cross_origin()
@login_required
def all_review():
    user_id = current_user.user_id
    exists = db.session.query(db.exists().where(Review.user_id == user_id)).scalar()

    if exists:
        reviews = []
        reviews_list = db.session.query(Review).filter(Review.user_id == user_id)
        for review in reviews_list:
            reviews.append({'isbn' : review.isbn, 'message_title' : review.message_title, 'message_body' : review.message_body, 'post_date' : review.post_date.strftime('%Y-%m-%d'), 'rating' : review.rating })      

        return jsonify({'reviews' : reviews})
  
    else:
        return 'User has no reviews', 404

# return all reviews created on isbn
@main.route('/book/<isbn>/review_all')
@cross_origin()
def all_review_book(isbn):
    exists = db.session.query(db.exists().where(Review.isbn == isbn)).scalar()

    if exists:
        reviews = []
        reviews_list = db.session.query(Review).filter(Review.isbn == isbn)
        for review in reviews_list:
            reviews.append({'user_id' : review.user_id, 'message_title' : review.message_title, 'message_body' : review.message_body, 'post_date' : review.post_date.strftime('%Y-%m-%d'), 'rating' : review.rating })      

        return jsonify({'reviews' : reviews})
  
    else:
        return 'Book has no reviews', 404

# return specific review data
@main.route('/book/<isbn>/review/<user_id>')
def specific_review(isbn, user_id):
    exists = db.session.query(db.exists().where(Review.isbn == isbn, Review.user_id == user_id )).scalar()

    if exists:
        reviews = []
        reviews_list = db.session.query(Review).filter(Review.isbn == isbn, Review.user_id == user_id)
        for review in reviews_list:
            reviews.append({'user_id' : user_id, 'isbn' : isbn, 'message_title' : review.message_title, 'message_body' : review.message_body, 'post_date' : review.post_date.strftime('%Y-%m-%d'), 'rating' : review.rating })      

        return jsonify({'reviews' : reviews})
  
    else:
        return 'This review does not exist', 404

# delete review
@main.route('/book/<isbn>/review/delete')
@cross_origin()
@login_required
def review_delete(isbn):
    user_id = current_user.user_id
    exists = db.session.query(db.exists().where(Review.isbn == isbn, Review.user_id == user_id )).scalar()

    if exists:
        db.session.query(Review).filter(Review.isbn == isbn, Review.user_id == user_id).delete()
        db.session.commit()
        
        return 'DELETED', 200
    else:
        return 'Review does not exist', 404

# ===========================================================
# user FUNCTIONS
# ===========================================================

# add a user with data from flask HTTP method
@main.route('/register/new', methods=['POST'])
def add_user():
    user_data = request.get_json()

    exists = db.session.query(db.exists().where(User.email == user_data['email'])).scalar()

    if not exists:
        new_user = User(fname=user_data['fname'], lname=user_data['lname'], email=user_data['email'],  role_value="customer", pass_word=generate_password_hash(user_data['pass_word'], method='sha256'))
        db.session.add(new_user)
        db.session.commit()

        db.session.add(add_customer(user_data['email']))
        db.session.commit()

        return 'Registered new user', 201
    else:
        return 'User with this email already exists', 409

# add new user to customer relation
def add_customer(email):
     user = db.session.query(User).filter(User.email == email).one()
     return Customer(user_id = user.user_id)
     
# return a specific user by id, specified in url
@main.route('/user/data/<user_id>')
@login_required
@admin_permission.require()
def user_data(user_id):
    exists = db.session.query(db.exists().where(User.user_id == user_id)).scalar()

    if exists:
        users = []
        user_list = db.session.query(User).filter(User.user_id == user_id).one()
        users.append({'fname' : user_list.fname, 'lname' : user_list.lname, 'email' : user_list.email})      

        return jsonify({'user' : users})
  
    else:
        return 'User does not exist', 404

# retrieve the email and password of a user and see if it matches user inputs
@main.route('/login', methods = ['POST'])
def log_in():
    user_data = request.get_json()
    user = db.session.query(User).filter(User.email == user_data['email']).one()

    if not user or not check_password_hash(user.pass_word, user_data['pass_word']):
        return 'Incorrect username or password', 401

    login_user(user)
    identity_changed.send(current_app._get_current_object(), identity=Identity(user.user_id))
    access_token = create_access_token(identity=user.user_id)

    return jsonify(access_token=access_token), 200

# logout user
@main.route('/logout')
@login_required
def logout():
    logout_user()

    for key in ('identity.name', 'identity.auth_type'):
        session.pop(key, None)

    identity_changed.send(current_app._get_current_object(), identity=AnonymousIdentity())
    return 'LOGGED OUT', 200

# return all orders from specific user_id
@main.route('/orders/all')
@login_required
def user_orders():
    user_id = current_user.user_id
    exists = db.session.query(db.exists().where(User.user_id == user_id)).scalar()

    if exists:
        orders = []
        order_list = db.session.query(Book_Order).filter(Book_Order.user_id == user_id)
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
  
    else:
        return 'User does not exist', 404

# update user
@main.route('/user/data/update', methods=['POST'])
@login_required
def update_order():
    user_id = current_user.user_id
    update_data = request.get_json()
    
    user  = db.session.query(User).filter(User.user_id == user_id).one()
    fname = user.fname
    lname = user.lname
    email = user.email
    password = user.pass_word

    if (update_data['fname'] != None):
        fname = update_data['fname']
    if (update_data['lname'] != None):
        lname = update_data['lname']
    if (update_data['email'] != None):
        email = update_data['email'] 
    if (update_data['pass_word'] != None):
        password = update_data['pass_word']

    user.fname = fname
    user.lname = lname
    user.email = email
    user.pass_word = password
    db.session.commit()

    return 'UPDATED USER', 201

# ===========================================================
# Recommendation FUNCTIONS
# ===========================================================

# add new recommendation
@main.route('/recommendation/new', methods=['POST'])
@login_required
def add_recommendation():
    user_id = current_user.user_id
    recommendation_data = request.get_json()

    new_recommendation = Recommendation(recipient_id=recommendation_data['recipient_id'], user_id=user_id)
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
@login_required
def recommend_delete():
    user_id = current_user.user_id
    recommendation_data = request.get_json()
    recommendation_exists = db.session.query(db.exists().where(Recommendation.recommend_id == recommendation_data['recommend_id'])).scalar()

    if recommendation_exists:
        Recommendation = db.session.qury(Recommendation).filter(Recommendation.recommend_id == recommend_data['recommend_id']).one()
        if (Recommendation.user_id == user_id):
            db.session.query(Sends).filter_by(recommend_id = recommendation_data['recommend_id']).delete()
            db.session.query(Author_Names).filter_by(recommend_id = recommendation_data['recommend_id']).delete()
            db.session.query(Recommendation).filter_by(recommend_id = recommendation_data['recommend_id']).delete()
            db.session.commit()
        else:
            return 'NOT PERMITTED', 401
        return 'DELETED', 200
    else:
        return 'RECOMMENDATION DOES NOT EXIST', 404

# return all recommendation to specific user_id
@main.route('/recommendation/user/all/')
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

# get existing recommendation data                                                                                                    
@main.route('/recommendation/view/<recommend_id>')
@login_required
def recommendation_data(recommend_id):
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

# auto-give recommendations, based on wishlist                                                                                                    
@main.route('/recommendation/<user_id>/auto')
def recommend_auto(user_id):
    wishlist_exists = db.session.query(db.exists().where(Wishlist.user_id == user_id)).scalar()

    if wishlist_exists:
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
        return 'No recommendations avaliable at this time', 404

# ===========================================================
# customer FUNCTIONS
# ===========================================================

# return a specific user's points by id, specified in url
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

# return a specific admin start date
@main.route('/admin/<user_id>')
@login_required
@admin_permission.require()
def start_date(user_id):
    exists = db.session.query(db.exists().where(Admin.user_id == user_id)).scalar()

    if exists:
        admins = []
        admin = db.session.query(Admin).filter(Admin.user_id == user_id).one()
        admins.append({'start_date' : admin.Start_date.strftime('%Y-%m-%d')})      

        return jsonify({'admin' : admins})
  
    else:
        return 'Admin does not exist', 404

# ===========================================================
# search FUNCTIONS
# ===========================================================

@main.route('/search/', methods = ['POST'])
@cross_origin()
def search():
    data = request.get_json()
    search_input = data['search']
    authors = []
    
    books = []
    sim_auth_fname = db.session.query(Author).filter(Author.fname.ilike(f'%{search_input}%')).all()
    sim_auth_lname = db.session.query(Author).filter(Author.lname.ilike(f'%{search_input}%')).all()
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
  