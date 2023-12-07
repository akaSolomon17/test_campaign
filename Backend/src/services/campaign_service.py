from dao.campaign_dao import *


def search_campaign(_user_id, _search, _start_date, _end_date):
    campaigns = search_campaign_dao(_user_id, _search, _start_date, _end_date)
    return campaigns if campaigns else None

def check_date(_start_date, _end_date):
    return _start_date <= _end_date


    




