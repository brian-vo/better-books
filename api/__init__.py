from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_principal import Principal, Permission, RoleNeed
from flask_principal import Principal, Identity, AnonymousIdentity, Principal, Permission, RoleNeed, identity_loaded, UserNeed
from flask_login import current_user


db = SQLAlchemy()

def create_app():
        app = Flask(__name__,
            static_url_path='', 
            static_folder='../src')
        app.app_context().push()

        app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:kQ4xei6b^@localhost:3306/bookshopdb'
        # app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:root^@database-1.cy3twvoecm4a.us-east-1.rds.amazonaws.com:3306/bookshopdb'
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        app.config['SECRET_KEY'] = 'q3t6v9y$B&E)H@McQfTjWnZr4u7x!z%C'

        db.init_app(app)

        login_manager = LoginManager()
        login_manager.login_view = 'auth.login'
        login_manager.init_app(app)

        from .models import User, Admin

        @login_manager.user_loader
        def load_user(user_id):
            u = (db.session.query(User).filter(User.user_id == user_id).one())
            return u
        login_manager.login_view = "???"

        principals = Principal(app)
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

        from .users import main
        app.register_blueprint(main)

        return app
