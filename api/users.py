from flask import Blueprint, jsonify, request
from . import db
from .models import Book
from .models import User

from sqlalchemy.sql import text


main = Blueprint('main', __name__)

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






# @main.route('/user_test/', methods=['POST'])
# def query_user():
#    user_data = request.get_json()
#    users = []

#    name = {'fname' : str(user_data['fname'])}
#    sql = text("SELECT * FROM user WHERE fname = :fname")
#    users_list = db.session.execute(sql, name)

#    for user in users_list:
#            users.append({'fname' : user.fname, 'lname' : user.lname, 'email' : user.email, 'pass_word' : user.pass_word})        

#    return jsonify({'users' : users})


# @main.route('/users/')
# def users():
#        # users_list = db.session.query(Book).all()
#        users_list = db.session.execute('select * from user where fname = "antony" ')
#        users = []
#
#        for user in users_list:
#            users.append({'fname' : user.fname, 'lname' : user.lname, 'email' : user.email, 'pass_word' : user.pass_word})        

#       return jsonify({'users' : users})