import jwt, os

from flask import Flask, request, make_response
from dotenv import load_dotenv
from config.errorStatus import errorStatus

from functools import wraps

# Load variables in .env environment
load_dotenv()

ACCESS_TOKEN_SECRET = os.getenv("ACCESS_TOKEN_SECRET")

def authMiddleware(func):
    @wraps(func)
    def middleware(*args, **kwargs):
        try:
            token = request.headers.get("Authorization")
            if not token:
                return errorStatus.statusCode("Invalid Authentication.", 400)

            user = jwt.decode(token, ACCESS_TOKEN_SECRET, algorithms=["HS256"])
            setattr(request, 'user', user)
            return func(*args, **kwargs)

        except jwt.ExpiredSignatureError:
            return errorStatus.statusCode("Token has expired.", 400)
        except jwt.InvalidTokenError:
            return errorStatus.statusCode("Invalid Authentication.", 400)
        except Exception as e:
            # return errorStatus.statusCode(str(e), 500)
            return str(e)
    return middleware