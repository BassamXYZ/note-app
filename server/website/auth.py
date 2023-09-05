from flask import Blueprint, request, jsonify, make_response, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from flask_restful import Resource, Api

from functools import wraps
import datetime
import jwt

from . import db
from .models import User


auth = Blueprint('auth', __name__)
api = Api(auth)


def token_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None

        if 'x-access-token' in request.headers:
            token = request.headers['x-access-token']

        if not token:
            return {'message': 'token is missing!'}, 401

        try:
            data = jwt.decode(
                token, current_app.config['SECRET_KEY'], algorithms=["HS256"])
            current_user = User.query.filter_by(email=data['email']).first()
        except:
            return {'message': 'token is invalid!'}, 401

        return f(current_user, *args, **kwargs)

    return decorated


class Login(Resource):
    def post(self):
        email = request.form['email']
        password = request.form['password']

        if not email or not password:
            return make_response('could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!'})

        user = User.query.filter_by(email=email).first()

        if not user:
            return make_response('could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!'})

        if check_password_hash(user.password, password):
            token = jwt.encode({'email': user.email, 'exp': datetime.datetime.utcnow(
            ) + datetime.timedelta(weeks=2)}, current_app.config['SECRET_KEY'], algorithm="HS256")
            return jsonify({'token': token})

        return make_response('could not verify', 401, {'WWW-Authenticate': 'Basic realm="Login required!'})


api.add_resource(Login, '/login')


class Signup(Resource):
    def post(self):
        email = request.form['email']
        password = request.form['password']

        user = User.query.filter_by(email=email).first()

        if user:
            return {'message': 'Email already exists'}
        elif len(email) < 4:
            return {'message': 'Email must be greater than 3 characters.'}
        elif len(password) < 8:
            return {'message': 'Password must be at least 8 characters.'}
        else:
            new_user = User(email=email,
                            password=generate_password_hash(password, method='sha256'))
            db.session.add(new_user)
            db.session.commit()
            token = jwt.encode({'email': new_user.email, 'exp': datetime.datetime.utcnow(
            ) + datetime.timedelta(weeks=2)}, current_app.config['SECRET_KEY'], algorithm="HS256")
            return jsonify({'token': token})


api.add_resource(Signup, '/signup')
