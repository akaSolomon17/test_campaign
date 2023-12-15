
from flask import Flask
from flask_restful import Api

from controllers.campaignController import *


def initialRoutesCampaign(api):

    # [GET] GET ALL CAMPAIGN
    api.add_resource(getAllCampaign,"/api/all_campaign", endpoint="campaign")

    # [GET] GET CAMPAIGN
    api.add_resource(getCampaign,"/api/campaign/<_camp_id>", endpoint="get_campaign")

    # [POST] ADD CAMPAIGN
    api.add_resource(addCampaign,"/api/add_campaign", endpoint="add_campaign")
    
    # [PUT] UPDATE CAMPAIGN
    api.add_resource(updateCampaign,"/api/update_campaign/<camp_id>", endpoint="update_campaign")

    # [POST] SHARE CAMPAIGN 
    # api.add_resource(searchCampaignAPI,"/api/campaign/search", endpoint="search_campaign")

    # [DELETE] DELETE CAMPAIGN
    api.add_resource(deleteCampaign,"/api/delete_campaign/<camp_id>", endpoint="delete_campaign")

    # [PUT] UPDATE BANNER CAMPAIGN
    api.add_resource(bannerCampaign,"/api/banner_campaign/<camp_id>", endpoint="banner_campaign")
    
    ## [GET] GET BANNER
    api.add_resource(getBannerCampaign,"/api/get_banner_campaign", endpoint="get_banner_campaign")
