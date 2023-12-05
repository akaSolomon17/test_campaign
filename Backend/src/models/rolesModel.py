import enum
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
# from sqlalchemy import Enum

from initSQL import db

class Roles(db.Model):
    role_id = db.Column(db.Enum('ADMIN','DAC','ADVERTISER'),default= 'ADMIN', primary_key=True)
    
    def __init__(self, role_id):
        self.role_id = role_id

