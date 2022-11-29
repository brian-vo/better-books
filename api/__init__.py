from flask import Flask
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def create_app():
        app = Flask(__name__)
        app.app_context().push()

        app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:kQ4xei6b^@localhost:3306/bookshopdb'
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

        db.init_app(app)
        
        from .users import main
        app.register_blueprint(main)

        return app

