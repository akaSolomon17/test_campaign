import uuid

from flask import Flask
from flask_sqlalchemy import SQLAlchemy

from datetime import datetime, timedelta
from initSQL import db

class Creatives(db.Model):
    creative_id = db.Column(db.INT, primary_key=True,autoincrement=True)
    title = db.Column(db.NVARCHAR(120), nullable=False)
    description = db.Column(db.NVARCHAR(255), nullable=False)
    img_preview = db.Column(db.VARCHAR(255), nullable=False)
    final_url = db.Column(db.NVARCHAR(255), nullable=False)
    create_at = db.Column(db.TIMESTAMP, default=datetime.now())
    update_at = db.Column(db.TIMESTAMP, default=datetime.now(), onupdate=datetime.now())
    delete_flag = db.Column(db.BOOLEAN, default=False)
    campaign_id = db.Column(db.INT, db.ForeignKey('campaigns.campaign_id'), nullable=False)
    
    def __init__(self,title,description,img_preview,final_url,delete_flag,campaign_id):
        self.title = title
        self.description = description
        self.img_preview = img_preview
        self.final_url = final_url
        self.delete_flag = delete_flag
        self.campaign_id = campaign_id