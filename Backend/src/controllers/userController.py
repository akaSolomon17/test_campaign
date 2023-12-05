import json, os,re,jwt
import bcrypt

from jwt.exceptions import *
from datetime import datetime, timedelta

from dotenv import load_dotenv
#FLASK
from flask import Flask, request, make_response,jsonify
from flask_restful import Resource, Api


from auth.auth import authMiddleware
from auth.authAdmin import authMiddlewareAdmin

from config.errorStatus import errorStatus
from sqlalchemy.orm.exc import NoResultFound

app = Flask(__name__)
api = Api(app)

# Load variables in .env environment
load_dotenv()
# Status code config to JSON
errConfig = errorStatus()

REFRESH_TOKEN_SECRET = os.getenv("REFRESH_TOKEN_SECRET")
ACCESS_TOKEN_SECRET = os.getenv("ACCESS_TOKEN_SECRET")

# Create Refresh Token
def createRefreshToken(user_id, role_id):
    exp_time = datetime.now() + timedelta(days = 7)
    
    payload = {
        "user_id": user_id,
        "role_id": role_id,
        "exp": exp_time
    }
    
    return jwt.encode(payload,REFRESH_TOKEN_SECRET,algorithm="HS256")
# Create Access Token
def createAccessToken(user_id, role_id):
    exp_time = datetime.now() + timedelta(minutes=15)
    
    payload = {
        "user_id": user_id,
        "role_id": role_id,
        "exp": exp_time
    }
    
    return jwt.encode(payload,ACCESS_TOKEN_SECRET,algorithm="HS256")

def validate_email(email):
    pattern = re.compile(r'^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$')
    # Kiểm tra địa chỉ email
    return pattern.match(email) is not None

def find_user_by_email(email):
    from initSQL import db
            
    from models.userModel import Users
    user = Users.query.filter_by(email=email).first()
    return user
# USER MODELS
# LOGIN
class login(Resource):
    def post(self):
        from initSQL import db
        from models.userModel import Users
        
        try:
            content_type = request.headers.get('Content-Type')
            if content_type == "application/json":
                json= request.get_json()
                email = json["email"]
                password = json["password"].encode('utf-8')
                
                if password=="" or email=="":
                    return errConfig.statusCode("Please fill in email/password field!",401)
                
                User = Users.query.filter_by(email = email).one()
                
                checkPW = bcrypt.checkpw(password, User.password.encode('utf-8'))
                
                if not checkPW:
                    return errConfig.statusCode("Wrong password!",401)
                 
                refresh_token = createRefreshToken(User.user_id, User.role_id)
                
                response = errConfig.statusCode("Login successful!")
                response.set_cookie('RefreshToken', refresh_token, max_age=7 * 24 * 60 * 60, path='/api/refresh_token', httponly=True) # Max_age is seconds not miliseconds.
                
                return response

            else: return "Content-Type not support!"
        except NoResultFound:
            return errConfig.statusCode('Email is not exist!',401)
        except Exception as e :
            return errConfig.statusCode(str(e),500)
# Get ACCESS_TOKEN
class getAccessToken(Resource):
    def post(self):
        from initSQL import db
                
        from models.userModel import Users
        try:
            refresh_token = request.cookies.get('RefreshToken')
            
            user = jwt.decode(refresh_token, REFRESH_TOKEN_SECRET, algorithms=["HS256"])
            user_id = user['user_id']
            
            User = Users.query.filter_by(user_id = user_id).one_or_404()
            
            
            if not refresh_token:
                return errConfig.statusCode("Please login again!",401)

            try:
                jwt.decode(refresh_token,REFRESH_TOKEN_SECRET,"HS256")

                access_token = createAccessToken(User.user_id,User.role_id)
                
                return access_token
            except InvalidTokenError:
                return errConfig.statusCode("Invalid token",401)
            except DecodeError:
                return errConfig.statusCode("Token failed validation",401)
            except InvalidSignatureError:
                return errConfig.statusCode("Invalid refresh token",401)
            except ExpiredSignatureError:
                return errConfig.statusCode("The RF token is expired",401)
            except Exception as e:
                return errConfig.statusCode(f"An unexpected error occurred: {str(e)}",500)
        except Exception as e:
            return errConfig.statusCode(str(e),500)
# GET USER INFOR

class getUser(Resource):
    @authMiddleware
    def get(self):
        from initSQL import db
        from models.userModel import Users

        token = request.headers.get("Authorization")
        if not token:
            return errorStatus.statusCode("Invalid Authentication.", 400)

        user = jwt.decode(token, ACCESS_TOKEN_SECRET, algorithms=["HS256"])
        user_id = user['user_id']
        
        User = Users.query.filter_by(user_id = user_id).options(db.defer(Users.password)).one_or_404()
        
        User_dict = User.__dict__
        User_dict.pop('_sa_instance_state', None) # Disable _sa_instance_state of SQLAlchemy (_sa_instance_state can't convert JSON)
        
        return jsonify(User_dict)
# GET ALL USER INFO
class getAllUser(Resource):
    @authMiddleware
    @authMiddlewareAdmin
    def get(self):
        from initSQL import db
        from models.userModel import Users
        
        users = Users.query.options(db.defer(Users.password)).all()
        # Users = db.session.execute(db.select(User).order_by(User.user_id).options(db.defer(User.password))).all()
        tuple_user = [{'user_id': user.user_id,
                       'role_id': user.role_id,
                       'first_name': user.first_name, 
                       'last_name': user.last_name,
                       'email': user.email,
                       'address': user.address,
                       'phone': user.phone,
                       'create_at': user.create_at,
                       'update_at': user.update_at,
                       'image': user.avatar,
                       } 
                    for user in users]

        return jsonify(users=tuple_user)
# LOGOUT
class logout(Resource):
    def get(self):
        try:
            response = errConfig.statusCode("Logout successful!")
            response.delete_cookie('RefreshToken','/api/refresh_token')
            return response
        except Exception as e:
            return errConfig.statusDefault(5)
# DELETE USER
class deleteUser(Resource):
    @authMiddleware
    @authMiddlewareAdmin
    def delete(self):
        from initSQL import db
        from models.userModel import Users
        try:
            access_token = request.header.get('Authorization')
            
            user = jwt.decode(refresh_token, ACCESS_TOKEN_SECRET, algorithms=["HS256"])
            user_id = user['user_id']
            
            User = Users.query.filter_by(user_id = user_id).one_or_404()
            if User:
                db.session.delete(User)
                db.session.commit()
                return errConfig.statusCode("Delete User successfully!")
            else:
                return errConfig.statusDefault(5)
            
        except Exception as e:
            # return errConfig.statusDefault(4)
            return errConfig.statusCode(str(e),500)
# ADD USER    
class addUser(Resource):
    @authMiddleware
    @authMiddlewareAdmin
    def post(self):
        from initSQL import db
        from models.userModel import Users

        try:
            json = request.get_json()
            email = json['email']
            first_name = json['first_name']
            last_name = json['last_name']
            role_id = json['role_id']
            address = json['address']
            phone = json['phone']
            password = json['password'].encode('utf-8')
            
            
            
            if not validate_email:
                return errConfig.statusCode("Invalid email",400)
            
            if find_user_by_email(email):
                return errConfig.statusCode("Email already in exist",400)
                                            
            if len(password) < 6:
                return errConfig.statusCode("Password must be at least 6 characters.",400)
            
            hashed_password = bcrypt.hashpw(password, bcrypt.gensalt())
            
            user = Users(email=email,first_name=first_name,last_name=last_name,role_id=role_id,address=address,phone=phone,password=hashed_password)
            db.session.add(user)
            db.session.commit()
            return errConfig.statusCode("Add User successfully!")
        except Exception as e:
            return errConfig.statusCode(str(e),500)
# UPDATE USER
class updateUser(Resource):
    @authMiddleware
    def put(self):
        from initSQL import db
        from models.userModel import Users

        token = request.headers.get("Authorization")
        if not token:
            return errorStatus.statusCode("Invalid Authentication.", 400)
        try:
            json = request.get_json()
            email = json['email']
            first_name = json['first_name']
            last_name = json['last_name']
            role_id = json['role_id']
            address = json['address']
            phone = json['phone']
            
            
            user = jwt.decode(token, ACCESS_TOKEN_SECRET, algorithms=["HS256"])
            user_id = user['user_id']
            
            user_to_update = Users.query.filter_by(id=user_id).first()
            
            user_updated = Users(id=user_id, email=email, first_name=first_name, last_name=last_name,role_id=role_id,address=address,phone=phone)
            db.session.merge(user_updated)
            db.session.commit()
            return errConfig.statusCode('Update user successfully!')
        except Exception as e:
            return errConfig.statusCode(str(e),500)

# DELETE ALL USERS
class deleteAllUser(Resource):
    @authMiddleware
    @authMiddlewareAdmin
    def delete(self):
        from initSQL import db
        from models.userModel import Users
        try:
            db.session.query(Users).delete()
            db.session.commit()
            return errConfig.statusCode('Delete all users successfully!')
        except Exception as e:
            return errConfig.statusCode(str(e),500)