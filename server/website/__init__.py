from flask import Flask
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from os import path


db = SQLAlchemy()
DB_NAME = 'database.db'


def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = 'hdugf/,ifjthshtp\jfjfbnsjjf'
    app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_NAME}'
    db.init_app(app)
    CORS(app, resource={
        r"/*": {
            "origins": "*"
        }
    })

    from .notes import notes
    from .auth import auth

    app.register_blueprint(notes, url_prefix='/')
    app.register_blueprint(auth, url_prefix='/')

    from .models import User, Note

    with app.app_context():
        if not path.exists('website/' + DB_NAME):
            db.create_all()

    return app
