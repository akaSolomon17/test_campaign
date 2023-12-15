import json, os, re, jwt,bcrypt

from collections import OrderedDict

from jwt.exceptions import *
from datetime import datetime, timedelta

from dotenv import load_dotenv
from sqlalchemy import func

# FLASK
from flask import Flask, request, make_response, jsonify
from flask_restful import Resource, Api

# AUTH
from auth.auth import authMiddleware
from auth.authAdmin import authMiddlewareAdmin

# CONFIG
from config.errorStatus import errorStatus

# SERVICES
from services.campaign_service import *

# MODELS
from initSQL import db
from models.campaignModel import Campaigns
from models.userModel import Users
from models.creativeModel import Creatives

app = Flask(__name__)
api = Api(app)

# Load variables in .env environment
load_dotenv()
# Status code config to JSON
errConfig = errorStatus()

REFRESH_TOKEN_SECRET = os.getenv("REFRESH_TOKEN_SECRET")
ACCESS_TOKEN_SECRET = os.getenv("ACCESS_TOKEN_SECRET")


# GET ALL CAMPAIGN
class getAllCampaign(Resource):
    @authMiddleware
    @authMiddlewareAdmin
    def get(self):
        try:
            campaigns = Campaigns.query.all()
            key_word = request.args.get('key_word')
            page_number = int(request.args.get('page_number', 1))
            start_date = request.args.get('start_date')
            end_date = request.args.get('end_date')

            if key_word is None:
                key_word = ""

            limit_number_records = 3
            offset = (page_number - 1) * limit_number_records
            
            if not isinstance(page_number, int) or page_number < 1:
                return errConfig.msgFeedback("",{"page_number": ["Invalid page number"]},400)

            all_campaign_data = []

            # Use a single query to fetch campaigns based on conditions
            query = Campaigns.query.filter(
                Campaigns.delete_flag == 0,
                Campaigns.start_date >= start_date,
                Campaigns.end_date <= end_date
            )

            if key_word == "ALL":
                campaign_list = query.limit(limit_number_records).offset(offset).all()
                total_records = query.count()
            else:
                campaign_filtered = query.filter(Campaigns.name.like(f"%{key_word}%"))
                campaign_list = query.filter(Campaigns.name.like(f"%{key_word}%")).limit(limit_number_records).offset(offset).all()
                total_records = campaign_filtered.count()
            
            if campaign_list:
                for campaign in campaign_list:
                    creatives = Creatives.query.filter_by(campaign_id=campaign.campaign_id).all()
                    tuple_creative = [
                        {
                            "creative_id": creative.creative_id,
                            "title": creative.title,
                            "description": creative.description,
                            "img_preview": creative.img_preview,
                            "final_url": creative.final_url,
                            "create_at": creative.create_at,
                            "update_at": creative.update_at,
                            "delete_flag": creative.delete_flag,
                            "campaign_id": creative.campaign_id,
                        }
                        for creative in creatives
                    ]

                    campaign_data = OrderedDict([
                        ("user_id", campaign.user_id),
                        ("name", campaign.name),
                        ("user_status", campaign.user_status),
                        ("used_amount", campaign.used_amount),
                        ("budget", campaign.budget),
                        ("status", campaign.status),
                        ("create_at", campaign.create_at),
                        ("update_at", campaign.update_at),
                        ("bid_amount", campaign.bid_amount),
                        ("start_date", str(campaign.start_date)),
                        ("end_date", str(campaign.end_date)),
                        ("usage_rate", campaign.usage_rate),
                        ("campaign_id", campaign.campaign_id),
                        ("creatives", tuple_creative)
                    ])

                    all_campaign_data.append(campaign_data)

                return errConfig.msgFeedback({
                    "campaign_list": all_campaign_data,
                    "total_records": total_records,
                    "page_number": page_number,
                    "limit_number_records": limit_number_records
                },"",200)
            
            else:
                return errConfig.msgFeedback({
                    "campaign_list": [],
                    "total_records": 0,
                    "page_number": page_number,
                    "limit_number_records": limit_number_records
                },"No Campaign found!",200)
        except Exception as e:
            return errConfig.msgFeedback("Unexpected Error: ",f"{str(e)}",200)

# GET ONE CAMPAIGN
class getCampaign(Resource):
    @authMiddleware
    def get(self, _camp_id):
        try:
            Campaign = (
                Campaigns.query.filter_by(campaign_id=_camp_id)
                .options(db.defer(Campaigns.delete_flag))
                .first()
            )
            if Campaign:
                Campaign_dict = Campaign.__dict__
                Campaign_dict.pop(
                    "_sa_instance_state", None
                )  # Disable _sa_instance_state of SQLAlchemy (_sa_instance_state can't convert JSON)

                return jsonify(Campaign_dict)
            else:
                return errConfig.msgFeedback("Campaign not found!","",200)
        except Exception as e:
            return errConfig.msgFeedback("Unexpected Error: ",f"{str(e)}",200)


# ADD CAMPAIGN
class addCampaign(Resource):
    @authMiddleware
    @authMiddlewareAdmin
    def post(self):
        try:
            json = request.get_json()
            user_id = json["user_id"]
            name = json["name"]
            bid_amount = json["bid_amount"]
            budget = json["budget"]
            start_date = json["start_date"]
            end_date = json["end_date"]
            status= json["status"]
            user_status = json["user_status"]
            title = json["title"]
            description = json["description"]
            img_preview = json["img_preview"]
            final_url = json["final_url"]

            if not check_date(start_date, end_date):
                return errConfig.msgFeedback("Invalid date","",200)
            
            if len(name) > 120 or len(name) ==0:
                return errConfig.msgFeedback("Invalid name. Please re-enter","",200)
            
            if len(title) > 120 or len(name) ==0:
                return errConfig.msgFeedback("Invalid title. Please re-enter","",200)

            if (len(description) >255 or len(img_preview) > 255 or len(final_url) > 255 
                or len(description) ==0 or len(img_preview) ==0 or len(final_url) ==0
                or len(bid_amount) ==0  or len(budget) == 0):
                return errConfig.msgFeedback("Invalid. Please re-enter","",200)
            try:
                campaign = Campaigns(
                    user_id=user_id,
                    name=name,
                    bid_amount=bid_amount,
                    budget=budget,
                    start_date=start_date,
                    end_date=end_date,
                    status=status,
                    user_status=user_status,
                    delete_flag=False,
                    used_amount=0,
                    usage_rate=0,
                )
                print(campaign)
                db.session.add(campaign)
                db.session.commit()
                db.session.refresh(campaign)

                campaign_id = campaign.campaign_id
                creative = Creatives(
                    campaign_id=campaign_id,
                    title=title,
                    description=description,
                    img_preview=img_preview,
                    final_url=final_url,
                    delete_flag=False,
                )
                print(creative)
                db.session.add(creative)
                db.session.commit()
                db.session.refresh(creative)
                return errConfig.msgFeedback("Add Campaign successfully!","",200)
            except Exception as e:
                return errConfig.msgFeedback("Add Campaign failed!",f"{str(e)}",200)
        except Exception as e:
            return errConfig.msgFeedback("Unexpected Error: ",f"{str(e)}",200)


# UPDATE CAMPAIGN BY ID
class updateCampaign(Resource):
    @authMiddleware
    def put(self, camp_id):
        try:
            json = request.get_json()
            user_id = json["user_id"]
            bid_amount = json["bid_amount"]
            budget = json["budget"]
            start_date = json["start_date"]
            end_date = json["end_date"]
            status = json["status"]
            title = json["title"]
            description = json["description"]
            img_preview = json["img_preview"]
            final_url = json["final_url"]
            
            if not check_date(start_date, end_date):
                return errConfig.msgFeedback("Invalid date","",200)
            
            # Không đổi tên campaign validate lại!
            # if len(name) > 120 or len(name) ==0:
            #     return errConfig.statusCode("Invalid name. Please re-enter",400)
            
            # if len(title) > 120 or len(name) ==0:
            #     return errConfig.statusCode("Invalid title. Please re-enter",400)

            if (len(description) >255 or len(img_preview) > 255 or len(final_url) > 255 
                or len(description) ==0 or len(img_preview) ==0 or len(final_url) ==0):
                # or len(bid_amount) == 0  or len(budget) == 0):
                return errConfig.msgFeedback("Invalid. Please re-enter","",200)
            
            
            
            campaign = Campaigns.query.filter(
                Campaigns.campaign_id == camp_id, Campaigns.user_id == user_id
            ).first()

            creative = Creatives.query.filter(
                Creatives.campaign_id == camp_id
            ).first()

            try:
                campaign.budget = budget
                campaign.bid_amount = bid_amount
                campaign.start_date = start_date
                campaign.end_date = end_date
                campaign.status = status
                creative = campaign.creative
                creative.title = title
                creative.description = description
                creative.img_preview = img_preview
                creative.url = final_url

                db.session.commit()
                
                return errConfig.msgFeedback("Update campaign successfully!","",200)
            except Exception as e:
                return errConfig.msgFeedback("Update campaign failed!",f"{str(e)}",200)
        except Exception as e:
            return errConfig.msgFeedback("Unexpected Error: ",f"{str(e)}",200)

# DELETE CAMPAIGN
class deleteCampaign(Resource):
    @authMiddleware
    @authMiddlewareAdmin
    def delete(self, camp_id):

        try:
            if camp_id is None:
                return errConfig.msgFeedback("Invalid campaign ID","",200)

            camp = Campaigns.query.filter(Campaigns.campaign_id == camp_id).first()
            creative = Creatives.query.filter(Creatives.campaign_id == camp_id).first()
           
            if camp:
                
                db.session.delete(camp)
                db.session.delete(creative)
                db.session.commit()
                return errConfig.msgFeedback("Delete Campaign successfully!","",200)
            else:
                return errConfig.msgFeedback("Delete Campaign failed!","",200)
        except Exception as e:
            return errConfig.msgFeedback("Unexpected Error: ",f"{str(e)}",200)


class bannerCampaign(Resource):
    @authMiddleware
    @authMiddlewareAdmin
    def put(self,camp_id):
        try:
            json = request.get_json()
            budget = int(json["budget"])
            end_date = json["end_date"]
            bid_amount = int(json['bid_amount'])
            user_status = json['user_status']

            if camp_id is None:
                return errConfig.msgFeedback("Invalid campaign ID","",200)

            camp = Campaigns.query.filter(Campaigns.campaign_id == camp_id).first()
            
            if camp:

                used_amount = camp.used_amount + bid_amount

                usage_rate = (bid_amount / budget) * 100

                remain = budget - used_amount 
                # return remain
                if end_date == datetime.today().date() or remain < bid_amount:
                    user_status = False

                camp.used_amount = used_amount
                camp.usage_rate = usage_rate
                camp.user_status = user_status
                db.session.commit()
                return errConfig.msgFeedback("Update campaign successfully!","",200)
            else:
                return errConfig.msgFeedback("Update campaign failed!","",200)
        except Exception as e:
            return errConfig.msgFeedback("Unexpected Error: ",f"{str(e)}",200)