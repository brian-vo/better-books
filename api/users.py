from flask import Blueprint, jsonify, request
from . import db
from .models import User

main = Blueprint('main', __name__)

@main.route('/add_user/', methods=['POST'])
def add_user():
    user_data = request.get_json()

    new_user = user(fname=user_data['fname'], lname=user_data['lname'], email=user_data['email'], pass_word=user_data['pass_word'], )

    db.session.add(new_user)
    db.session.commit()

    return 'Done', 201

@main.route('/users/')
def users():
        users_list = db.session.query(User).all()
        users = []

        for user in users_list:
            users.append({'fname' : user.fname, 'lname' : user.lname, 'email' : user.email, 'pass_word' : user.pass_word})        

        return jsonify({'users' : users})