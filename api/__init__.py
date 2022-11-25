from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_marshmallow import Marshmallow

db = SQLAlchemy()
migrate = Migrate()
ma = Marshmallow()

def create_app():
        app = Flask(__name__)
        app.app_context().push()

        app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://root:kQ4xei6b^@localhost:3306/bookshopdb'
        app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

        db.init_app(app)
        migrate.init_app(app, db)
        ma.init_app(app)
        
        from .users import main
        app.register_blueprint(main)

        return app

