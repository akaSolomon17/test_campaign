from models.campaignModel import Campaigns
from common.utils.images import save_preview
from initSQL import db


def check_date(_start_date, _end_date):
    return _end_date >= _start_date


def search_campaign_dao(_user_id, _search, _start_date, _end_date):
    if _start_date is None or _end_date is None:
        campaigns = Campaigns.query.filter(
            Campaigns.user_id == _user_id,
            Campaigns.name.like('%'+_search+'%')).first()
    else:
        campaigns = Campaigns.query.filter(
            Campaigns.user_id == _user_id,
            Campaigns.name.like('%'+_search+'%'),
            Campaigns.start_date >= _start_date,
            Campaigns.end_date <= _end_date).first()
    return campaigns if campaigns else None




    
    

    
    

