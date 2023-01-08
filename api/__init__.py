from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_principal import Principal, Permission, RoleNeed
from flask_principal import Principal, Identity, AnonymousIdentity, Principal, Permission, RoleNeed, identity_loaded, UserNeed
from flask_login import current_user
from flask_jwt_extended import JWTManager
from flask_cors import CORS

db = SQLAlchemy()

def create_app():
        app = Flask(__name__,
            static_url_path='', 
            static_folder='../src')
        app.app_context().push()

        # configure keys here
        app.config['SQLALCHEMY_DATABASE_URI'] = 'SQL-SERVER-LOGIN-HERE'
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        app.config['SECRET_KEY'] = 'PASSWORD--SECRET-KEY-HERE'
        app.config["JWT_SECRET_KEY"] = "JWT-SECRET-KEY-HERE"
        
        # handle CORS, modify origins to match your frontend url if using differnet url
        CORS(app)
        CORS(app, origins=["http://localhost:3000"])
        app.config['CORS_HEADERS'] = 'Content-Type'

        db.init_app(app)
        jwt = JWTManager(app)

        login_manager = LoginManager()
        login_manager.login_view = 'auth.login'
        login_manager.init_app(app)

        # Create user loader function
        @login_manager.user_loader
        def load_user(user_id):
            u = (db.session.query(User).filter(User.user_id == user_id).one())
            return u
        login_manager.login_view = "/"

        principals = Principal(app)

        # this is imported inside function, as otherwise a circular import is created when importing db in models.py
        from .models import User, Admin

        # assign roles to users in flask-principal
        @identity_loaded.connect_via(app)
        def on_identity_loaded(sender, identity):
            # Set the identity user object
            identity.user = current_user

            # Add the UserNeed to the identity
            if hasattr(current_user, 'user_id'):
                identity.provides.add(UserNeed(current_user.user_id))

            # Assuming the User model has a list of roles, update the
            # identity with the roles that the user provides
            if hasattr(current_user, 'role_value'):
                identity.provides.add(RoleNeed(current_user.role_value))

        # this is imported inside function, as otherwise a circular import is created when importing db in users.py
        from .flaskapi import main
        app.register_blueprint(main)

        return app