import uuid, enum

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from datetime import datetime, timedelta
from initSQL import db

    
class Campaigns(db.Model):
    campaign_id = db.Column(db.INT, primary_key = True,autoincrement=True)
    name = db.Column(db.NVARCHAR(120), nullable=False)
    user_status = db.Column(db.BOOLEAN, default = True, nullable = False)
    budget = db.Column(db.INT, nullable=False)
    bid_amount = db.Column(db.INT, nullable=False)
    user_id = db.Column(db.INT, db.ForeignKey('users.user_id'))
    used_amount = db.Column(db.INT, nullable=False)
    usage_rate = db.Column(db.FLOAT, nullable=False)
    start_date = db.Column(db.DATETIME, nullable=False)
    end_date = db.Column(db.DATETIME, nullable=False)
    create_at = db.Column(db.TIMESTAMP, default=datetime.now())
    update_at = db.Column(db.TIMESTAMP, default=datetime.now())
    delete_flag = db.Column(db.BOOLEAN, default=False)
    
    user = db.relationship('Users',backref = db.backref('campaigns'), lazy=True)
    creative = db.relationship('Creatives',backref = db.backref('campaigns'), lazy=True)
    
    def __init__(self,name,user_status, used_amount,usage_rate,budget,bid_amount,start_date,end_date,delete_flag,user_id):
        self.name = name
        self.user_status = user_status
        self.used_amount = used_amount
        self.usage_rate = usage_rate
        self.budget = budget
        self.bid_amount = bid_amount
        self.start_date = start_date
        self.end_date = end_date
        self.delete_flag = delete_flag
        self.user_id = user_id
        