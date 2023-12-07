import json, os, re, jwt,bcrypt

from collections import OrderedDict

from jwt.exceptions import *
from datetime import datetime, timedelta

from dotenv import load_dotenv

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
            
            if campaigns:
                campaign_list = []
                for campaign in campaigns:
                    creatives = Creatives.query.filter_by(campaign_id=campaign.campaign_id).all()
                    tuple_creative = [
                        {
                            "creative_id": creative.creative_id,
                            "title": creative.title,
                            "description": creative.description,
                            "img_preview": creative.img_preview,
                            "final_url": creative.final_url,
                            "status": creative.status,
                            "create_at": creative.create_at,
                            "update_at": creative.update_at,
                            "delete_flag": creative.delete_flag,
                            "campaign_id": creative.campaign_id,
                        }
                        for creative in creatives
                    ]

                    campaign_info = OrderedDict([
                        ("user_id", campaign.user_id),
                        ("name", campaign.name),
                        ("user_status", campaign.user_status),
                        ("used_amount", campaign.used_amount),
                        ("budget", campaign.budget),
                        ("create_at", campaign.create_at),
                        ("update_at", campaign.update_at),
                        ("bid_amount", campaign.bid_amount),
                        ("start_date", str(campaign.start_date)),
                        ("end_date", str(campaign.end_date)),
                        ("usage_rate", campaign.usage_rate),
                        ("campaign_id", campaign.campaign_id),
                        ("creatives", tuple_creative)
                    ])

                    campaign_list.append(campaign_info)

                return jsonify(campaigns=campaign_list)
            else:
                return errConfig.statusCode("Campaign not found", 404)
        except Exception as e:
            return errConfig.statusCode(str(e), 500)

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
                return errConfig.statusCode("Campaign not found!", 404)
        except Exception as e:
            return errConfig.statusCode(str(e), 500)


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
            user_status = json["user_status"]
            title = json["title"]
            description = json["description"]
            img_preview = json["img_preview"]
            final_url = json["final_url"]

            if not check_date(start_date, end_date):
                return errConfig.statusCode("Invalid date",400)
            
            if len(name) > 120 or len(name) ==0:
                return errConfig.statusCode("Invalid name. Please re-enter",400)
            
            if len(title) > 120 or len(name) ==0:
                return errConfig.statusCode("Invalid title. Please re-enter",400)

            if (len(description) >255 or len(img_preview) > 255 or len(final_url) > 255 
                or len(description) ==0 or len(img_preview) ==0 or len(final_url) ==0
                or len(bid_amount) ==0  or len(budget) == 0):
                return errConfig.statusCode("Invalid. Please re-enter",400)
            try:
                campaign = Campaigns(
                    user_id=user_id,
                    name=name,
                    bid_amount=bid_amount,
                    budget=budget,
                    start_date=start_date,
                    end_date=end_date,
                    user_status=user_status,
                    delete_flag=False,
                    used_amount=0,
                    usage_rate=0,
                )
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
                    status=True,
                )

                db.session.add(creative)
                db.session.commit()
                db.session.refresh(creative)

                return errConfig.statusCode("Add Campaign successfully!",200)
            except Exception as e:
                return errConfig.statusCode(f"Add Campaign failed!{str(e)}",400)
        except Exception as e:
            return errConfig.statusCode(str(e), 500)


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
            user_status = json["user_status"]
            title = json["title"]
            description = json["description"]
            img_preview = json["img_preview"]
            final_url = json["final_url"]

            if not check_date(start_date, end_date):
                return errConfig.statusCode("Invalid date", 400)
            
            # Không đổi tên campaign validate lại!
            # if len(name) > 120 or len(name) ==0:
            #     return errConfig.statusCode("Invalid name. Please re-enter",400)
            
            # if len(title) > 120 or len(name) ==0:
            #     return errConfig.statusCode("Invalid title. Please re-enter",400)

            if (len(description) >255 or len(img_preview) > 255 or len(final_url) > 255 
                or len(description) ==0 or len(img_preview) ==0 or len(final_url) ==0):
                # or len(bid_amount) == 0  or len(budget) == 0):
                return errConfig.statusCode("Invalid. Please re-enter",400)

            campaign = Campaigns.query.filter(
                Campaigns.campaign_id == camp_id, Campaigns.user_id == user_id
            ).first()

            creative = Creatives.query.filter(
                Creatives.campaign_id == camp_id
            ).first()

            try:
                campaign.status = user_status
                campaign.budget = budget
                campaign.bid_amount = bid_amount
                campaign.start_date = start_date
                campaign.end_date = end_date

                creative = campaign.creative
                creative.title = title
                creative.description = description
                creative.img_preview = img_preview
                creative.url = final_url

                db.session.commit()
                return errConfig.statusCode("Update campaign successfully!",200)
            except Exception as e:
                return errConfig.statusCode(f"Update campaign failed!{str(e)}",400)
        except Exception as e:
            return errConfig.statusCode(str(e), 500)


# SEARCH CAMPAIGN 
class searchCampaignAPI(Resource):
    @authMiddleware
    def post(self):
        from initSQL import db

        try:
            json = request.get_json()
            name = json["name"]
            user_id = json["user_id"]
            start_date = json["start_date"]
            end_date = json["end_date"]

            if not check_date(start_date, end_date):
                return errConfig.statusCode("Invalid date", 400)

            campaign_search = search_campaign(user_id, name, start_date, end_date)
            if campaign_search:
                db.session.merge(campaign_search)
                db.session.commit()
                return errConfig.statusCode("Search campaign successfully!",200)
            else:
                return errConfig.statusCode("Search campaign failed!", 400)
        except Exception as e:
            return errConfig.statusCode(str(e), 500)


# DELETE CAMPAIGN
class deleteCampaign(Resource):
    @authMiddleware
    @authMiddlewareAdmin
    def delete(self, camp_id):

        try:
            if camp_id is None:
                return errConfig.statusCode("Invalid campaign ID", 404)

            camp = Campaigns.query.filter(Campaigns.campaign_id == camp_id).first()
            campaign_id = camp.campaign_id
            creative = Creatives.query.filter(Creatives.campaign_id ==campaign_id).first()

            if camp:
                db.session.delete(camp)
                db.session.delete(creative)
                db.session.commit()
                return errConfig.statusCode("Delete Campaign successfully!",200)
            else:
                return errConfig.statusCode("Delete Campaign failed!", 400)
        except Exception as e:
            return errConfig.statusCode(str(e), 500)


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
                return errConfig.statusCode("Invalid campaign ID", 404)

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
                    
                return errConfig.statusCode("Update campaign successfully!",200)
            else:
                return errConfig.statusCode("Update campaign failed!",400)

        except Exception as e:
            return errConfig.statusCode(str(e), 500)