
from flask import Flask
from flask_restful import Api

from controllers.userController import login, logout, getUser, getAllUser, getAccessToken, deleteUser,addUser, deleteAllUser, updateUser


def initialRoutes(api):

    # [POST] LOGIN
    api.add_resource(login,"/api/login", endpoint="login")

    # [POST] GET TOKEN
    api.add_resource(getAccessToken,"/api/refresh_token", endpoint="refresh_token")

    # [GET] LOGOUT
    api.add_resource(logout,"/api/logout", endpoint="user_logout")

    # [GET] GET USER
    api.add_resource(getUser,"/api/user_info", endpoint="get_user")

    # [GET] GET ALL USERS
    api.add_resource(getAllUser,"/api/all_user_info", endpoint="get_all_user")
    
    # [POST] ADD USER
    api.add_resource(addUser,"/api/add_user", endpoint="add_user")
    
    # [DELETE] DELETE USER
    api.add_resource(deleteUser,"/api/delete_user", endpoint="delete_user")
    
    # [DELETE] DELETE ALL USERS
    api.add_resource(deleteAllUser,"/api/delete_all_user", endpoint="delete_all_user")
    
    # [PUT] UPDATE USER
    api.add_resource(deleteAllUser,"/api/update_all_user", endpoint="update_all_user")