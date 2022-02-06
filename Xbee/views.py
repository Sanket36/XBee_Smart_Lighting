import pytz
from dateutil import parser
from datetime import datetime
import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from digi.xbee.io import IOLine, IOMode, IOValue
from time import sleep
from .models import *
from .Coordinator import Coordinator
from Scheduler.jobs import *


def get_nodes(request):
    list = []
    for node in Coordinator().NodesList:

        val = 25

        if (node.get_dio_value(IOLine.DIO12) == IOValue.HIGH and node.get_dio_value(IOLine.DIO11_PWM1) == IOValue.LOW
                and node.get_dio_value(IOLine.DIO8) == IOValue.LOW):
            val = 25

        elif (node.get_dio_value(IOLine.DIO12) == IOValue.HIGH and node.get_dio_value(IOLine.DIO11_PWM1) == IOValue.HIGH
              and node.get_dio_value(IOLine.DIO8) == IOValue.LOW):
            val = 50

        elif (node.get_dio_value(IOLine.DIO12) == IOValue.HIGH and node.get_dio_value(IOLine.DIO11_PWM1) == IOValue.LOW
              and node.get_dio_value(IOLine.DIO8) == IOValue.HIGH):
            val = 75

        elif (node.get_dio_value(IOLine.DIO12) == IOValue.HIGH and node.get_dio_value(IOLine.DIO11_PWM1) == IOValue.HIGH
              and node.get_dio_value(IOLine.DIO8) == IOValue.HIGH):
            val = 100

        temp = node.get_adc_value(IOLine.DIO0_AD0)
        temp = ((temp * 1.2 / 1023) - 0.5) * 100
        data = {'id': node.get_node_id(),
                'relay': True if node.get_dio_value(IOLine.DIO4_AD4) == IOValue.HIGH else False,
                'dim': val,
                'current': 50, 'temp': int(temp)}
        list.append(data)

    return JsonResponse({'nodes': list})


def discover_nodes(request):
    xbee_network = Coordinator().XBeeNetwork
    xbee_network.start_discovery_process(deep=True, n_deep_scans=1)
    while xbee_network.is_discovery_running():
        sleep(0.1)

    nodes = xbee_network.get_devices()
    Coordinator().NodesList = nodes

    list = []
    for node in nodes:
        if not Node.objects.filter(HexAddr=node.get_64bit_addr()).exists():
            Node.objects.create(NodeId=node.get_node_id(), HexAddr=node.get_64bit_addr())

        val = 25

        if (node.get_dio_value(IOLine.DIO12) == IOValue.HIGH and node.get_dio_value(IOLine.DIO11_PWM1) == IOValue.LOW
                and node.get_dio_value(IOLine.DIO8) == IOValue.LOW):
            val = 25

        elif (node.get_dio_value(IOLine.DIO12) == IOValue.HIGH and node.get_dio_value(IOLine.DIO11_PWM1) == IOValue.HIGH
              and node.get_dio_value(IOLine.DIO8) == IOValue.LOW):
            val = 50

        elif (node.get_dio_value(IOLine.DIO12) == IOValue.HIGH and node.get_dio_value(IOLine.DIO11_PWM1) == IOValue.LOW
              and node.get_dio_value(IOLine.DIO8) == IOValue.HIGH):
            val = 75

        elif (node.get_dio_value(IOLine.DIO12) == IOValue.HIGH and node.get_dio_value(IOLine.DIO11_PWM1) == IOValue.HIGH
              and node.get_dio_value(IOLine.DIO8) == IOValue.HIGH):
            val = 100

        temp = node.get_adc_value(IOLine.DIO0_AD0)
        temp = ((temp * 1.2 / 1023) - 0.5) * 100

        data = {'id': node.get_node_id(),
                'relay': True if node.get_dio_value(IOLine.DIO4_AD4) == IOValue.HIGH else False,
                'dim': val,
                'current': 50, 'temp': int(temp)}
        list.append(data)

    return JsonResponse({'nodes': list})


def toggle_pin(request):
    xbee_network = Coordinator().XBeeNetwork
    if request.GET.get("isGlobal"):
        status = request.GET.get("status")
        nodes = xbee_network.get_devices()

        val = True
        if status != "on":
            val = False
        for node in nodes:
            node.set_dio_value(IOLine.DIO4_AD4, IOValue.HIGH if val else IOValue.LOW)
    else:
        id = request.GET.get("id")
        print(id)
        status = request.GET.get("status")
        remote_node = xbee_network.get_device_by_node_id(id)
        if status == "on":
            remote_node.set_dio_value(IOLine.DIO4_AD4, IOValue.HIGH)
        else:
            remote_node.set_dio_value(IOLine.DIO4_AD4, IOValue.LOW)
    return JsonResponse({"succ": "done"})


def dim_to(request):
    xbee_network = Coordinator().XBeeNetwork
    val = int(request.GET.get("value"))
    if request.GET.get('isGlobal'):
        nodes = xbee_network.get_devices()

        for node in nodes:
            if val == 25:
                node.set_dio_value(IOLine.DIO12, IOValue.HIGH)
                node.set_dio_value(IOLine.DIO11_PWM1, IOValue.LOW)
                node.set_dio_value(IOLine.DIO8, IOValue.LOW)

            elif val == 50:
                node.set_dio_value(IOLine.DIO12, IOValue.HIGH)
                node.set_dio_value(IOLine.DIO11_PWM1, IOValue.HIGH)
                node.set_dio_value(IOLine.DIO8, IOValue.LOW)

            elif val == 75:
                node.set_dio_value(IOLine.DIO12, IOValue.HIGH)
                node.set_dio_value(IOLine.DIO11_PWM1, IOValue.LOW)
                node.set_dio_value(IOLine.DIO8, IOValue.HIGH)

            elif val == 100:
                node.set_dio_value(IOLine.DIO12, IOValue.HIGH)
                node.set_dio_value(IOLine.DIO11_PWM1, IOValue.HIGH)
                node.set_dio_value(IOLine.DIO8, IOValue.HIGH)
            else:
                return JsonResponse({"err": "Invalid value"})
        return JsonResponse({"succ": "done"})
    else:
        id = request.GET.get("id")

        remote_node = xbee_network.get_device_by_node_id(id)
        if val == 10:
            remote_node.set_dio_value(IOLine.DIO2_AD2, IOValue.LOW)
            remote_node.set_dio_value(IOLine.DIO4_AD4, IOValue.LOW)
            remote_node.set_dio_value(IOLine.DIO11_PWM1, IOValue.LOW)
            return JsonResponse({"succ": "done"})

        elif val == 25:
            remote_node.set_dio_value(IOLine.DIO12, IOValue.HIGH)
            remote_node.set_dio_value(IOLine.DIO11_PWM1, IOValue.LOW)
            remote_node.set_dio_value(IOLine.DIO8, IOValue.LOW)
            return JsonResponse({"succ": "done"})

        elif val == 50:
            remote_node.set_dio_value(IOLine.DIO12, IOValue.HIGH)
            remote_node.set_dio_value(IOLine.DIO11_PWM1, IOValue.HIGH)
            remote_node.set_dio_value(IOLine.DIO8, IOValue.LOW)
            return JsonResponse({"succ": "done"})

        elif val == 75:
            remote_node.set_dio_value(IOLine.DIO12, IOValue.HIGH)
            remote_node.set_dio_value(IOLine.DIO11_PWM1, IOValue.LOW)
            remote_node.set_dio_value(IOLine.DIO8, IOValue.HIGH)
            return JsonResponse({"succ": "done"})

        elif val == 100:
            remote_node.set_dio_value(IOLine.DIO12, IOValue.HIGH)
            remote_node.set_dio_value(IOLine.DIO11_PWM1, IOValue.HIGH)
            remote_node.set_dio_value(IOLine.DIO8, IOValue.HIGH)
            return JsonResponse({"succ": "done"})

        else:
            return JsonResponse({"err": "Invalid value"})


def getInstValues(request):
    list = []
    for node in Coordinator().NodesList:
        modelNode = Node.objects.get(NodeId=node.get_node_id())

        data = {'id': node.get_node_id(),
                'current': 50, 'temp': InsValue.objects.filter(NodeId=modelNode).first().TempValue}
        list.append(data)

    return JsonResponse({'values': list})


def getGraphValues(request):
    id = request.GET.get('id')
    modelNode = Node.objects.get(NodeId=id)

    i = 9

    curr = []
    temp = []
    for node in InsValue.objects.filter(NodeId=modelNode).order_by('-datetime')[:10]:
        curr.append([i, node.CurrValue])
        temp.append([i, node.TempValue])
        i -= 1

    curr.append(["x", "current"])
    temp.append(["x", "temperature"])

    curr = curr[::-1]
    temp = temp[::-1]
    return JsonResponse({'curr': curr, 'temp': temp})


def fetchSchedule(request):
    data = {'sunrise': Coordinator().SunRise, 'sunset': Coordinator().SunSet, 'schedule': Coordinator().autoSchedule}
    return JsonResponse(data)


def syncAuto(request):
    curr = datetime.now().astimezone(pytz.timezone('Asia/Kolkata')).strftime("%H:%M")
    set = Coordinator().autoSchedule[0]['from'].strftime("%H:%M")
    rise = Coordinator().autoSchedule[-1]['to'].strftime("%H:%M")

    if curr >= set or curr < rise:
        make_all_on()
        funcMap = {'set_dim_100': set_dim_100, 'set_dim_75': set_dim_75, 'set_dim_50': set_dim_50, 'set_dim_25': set_dim_25}
        for s in Coordinator().autoSchedule:
            begin = s['from'].strftime("%H:%M")
            end = s['to'].strftime("%H:%M")
            if begin < end:
                if begin <= curr < end:
                    f = funcMap['set_dim_{}'.format(s['i'])]
                    f()
            else:
                if curr >= begin or curr < end:
                    f = funcMap['set_dim_{}'.format(s['i'])]
                    f()
    else:
        make_all_off()

    return JsonResponse({'status': "ok"})


@csrf_exempt
def changeSchedule(request):
    schedule = request.body.decode('utf-8')
    schedule = json.loads(schedule)
    schedule = schedule['schedule']
    Coordinator().autoSchedule = schedule
    scheduler = Coordinator().scheduler
    funcMap = {'set_dim_100': set_dim_100, 'set_dim_75': set_dim_75, 'set_dim_50': set_dim_50, 'set_dim_25': set_dim_25}
    cnt = 0

    for s in schedule:
        fromTime = parser.isoparse(s['from']).astimezone(pytz.timezone('Asia/Kolkata'))
        toTime = parser.isoparse(s['to']).astimezone(pytz.timezone('Asia/Kolkata'))
        s['from'] = fromTime
        s['to'] = toTime
        j = scheduler.get_job(f'dim_{cnt}')
        if j is None:
            scheduler.add_job(funcMap['set_dim_{}'.format(s['i'])], 'cron', id=f'dim_{cnt}', hour=fromTime.hour, minute=fromTime.minute, timezone='Asia/Kolkata')
        else:
            j.remove()
            scheduler.add_job(funcMap['set_dim_{}'.format(s['i'])], 'cron', id=f'dim_{cnt}', hour=fromTime.hour, minute=fromTime.minute, timezone='Asia/Kolkata')
        cnt += 1
    
    syncAuto(request)
    return JsonResponse({"succ": "done"})
