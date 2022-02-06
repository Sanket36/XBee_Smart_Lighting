from Xbee.models import *
from digi.xbee.io import IOLine, IOValue
from Xbee.Coordinator import Coordinator
from astral import LocationInfo
from astral.sun import sun


def getInsValue():
    for node in Node.objects.all():
        remote_node = Coordinator().XBeeNetwork.get_device_by_node_id(node.NodeId)
        if remote_node is not None:
            temp = remote_node.get_adc_value(IOLine.DIO0_AD0)
            curr = remote_node.get_adc_value(IOLine.DIO1_AD1)
            # conversion
            curr = curr - 447
            if 150 > curr > 50:
                curr = curr * 2.93
            elif 250 > curr > 150:
                curr = curr * 2.44
            elif 350 > curr > 250:
                curr = curr * 2.27
            else:
                curr = curr * 2.3
            temp = ((temp * 1.2 / 1023) - 0.5) * 100
            InsValue.objects.create(NodeId=node, CurrValue=curr, TempValue=temp)


def set_dim_25():
    for node in Coordinator().NodesList:
        node.set_dio_value(IOLine.DIO12, IOValue.HIGH)
        node.set_dio_value(IOLine.DIO11_PWM1, IOValue.LOW)
        node.set_dio_value(IOLine.DIO8, IOValue.LOW)


def set_dim_50():
    for node in Coordinator().NodesList:
        node.set_dio_value(IOLine.DIO12, IOValue.HIGH)
        node.set_dio_value(IOLine.DIO11_PWM1, IOValue.HIGH)
        node.set_dio_value(IOLine.DIO8, IOValue.LOW)


def set_dim_75():
    for node in Coordinator().NodesList:
        node.set_dio_value(IOLine.DIO12, IOValue.HIGH)
        node.set_dio_value(IOLine.DIO11_PWM1, IOValue.LOW)
        node.set_dio_value(IOLine.DIO8, IOValue.HIGH)


def set_dim_100():
    for node in Coordinator().NodesList:
        node.set_dio_value(IOLine.DIO12, IOValue.HIGH)
        node.set_dio_value(IOLine.DIO11_PWM1, IOValue.HIGH)
        node.set_dio_value(IOLine.DIO8, IOValue.HIGH)


def fetchSunModel():
    city = LocationInfo(name="pune", region="India", timezone="Asia/Kolkata", latitude=18.6452489, longitude=73.92318563785392)
    s = sun(city.observer, tzinfo=city.timezone)
    Coordinator().SunRise = s["sunrise"].strftime("%I:%M %p")
    Coordinator().SunSet = s["sunset"].strftime("%I:%M %p")
    Coordinator().autoSchedule[0]['from'] = s["sunset"]
    Coordinator().autoSchedule[-1]['to'] = s["sunrise"]

    scheduler = Coordinator().scheduler
    j = scheduler.get_job('sunset')
    if j is None:
        scheduler.add_job(make_all_on, 'cron', id='sunset', hour=s["sunset"].hour, minute=s["sunset"].minute, timezone='Asia/Kolkata')
    else:
        j.reschedule('cron', hour=s["sunset"].hour, minute=s["sunset"].minute, timezone='Asia/Kolkata')
    j = scheduler.get_job('sunrise')
    if j is None:
        scheduler.add_job(make_all_off, 'cron', id='sunrise',  hour=s["sunrise"].hour, minute=s["sunrise"].minute, timezone='Asia/Kolkata')
    else:
        j.reschedule('cron', hour=s["sunrise"].hour, minute=s["sunrise"].minute, timezone='Asia/Kolkata')


def make_all_on():
    print("Turning devices on now")
    for node in Coordinator().NodesList:
        node.set_dio_value(IOLine.DIO4_AD4, IOValue.HIGH)

def make_all_off():
    print("Turning devices off now")
    for node in Coordinator().NodesList:
        node.set_dio_value(IOLine.DIO4_AD4, IOValue.LOW)
