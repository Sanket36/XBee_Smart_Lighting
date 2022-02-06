from Xbee.Coordinator import Coordinator
from .jobs import *

def start():
    scheduler = Coordinator().scheduler
    scheduler.add_job(getInsValue, 'interval', seconds=30, id='inst_values')
    scheduler.add_job(fetchSunModel, 'cron', id='sunmodel', hour=0, minute=15, timezone='Asia/Kolkata')

    scheduler.start()