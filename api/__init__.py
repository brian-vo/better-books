from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager

db = SQLAlchemy()

def create_app():
        app = Flask(__name__)
        app.app_context().push()

        app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:kQ4xei6b^@localhost:3306/bookshopdb'
        # app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:root^@database-1.cy3twvoecm4a.us-east-1.rds.amazonaws.com:3306/bookshopdb'
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
        app.config['SECRET_KEY'] = 'q3t6v9y$B&E)H@McQfTjWnZr4u7x!z%C'

        db.init_app(app)

        login_manager = LoginManager()
        login_manager.login_view = 'auth.login'
        login_manager.init_app(app)

        from .models import User

        @login_manager.user_loader
        def load_user(user_id):
            u = (db.session.query(User).filter(User.user_id == user_id).one())
            return u
        
        from .users import main
        app.register_blueprint(main)

        return app
