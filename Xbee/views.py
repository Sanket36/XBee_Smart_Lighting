from django.shortcuts import render
from django.http import JsonResponse
from digi.xbee.devices import XBeeDevice
from django.views.decorators.csrf import csrf_exempt
from digi.xbee.io import IOLine, IOMode, IOValue
from time import time, sleep

cordinator_xbee = None
xbee_network = None

def make_connection(request):
    global cordinator_xbee
    cordinator_xbee = XBeeDevice("/dev/ttyUSB0", 9600)
    cordinator_xbee.open()
    return JsonResponse({"msg": "cordinator connected"})

def discover_nodes(request):
    global cordinator_xbee, xbee_network
    xbee_network = cordinator_xbee.get_network()
    xbee_network.start_discovery_process(deep=True, n_deep_scans=1)
    while xbee_network.is_discovery_running():
        sleep(0.5)

    nodes = xbee_network.get_devices()

    count = 2
    for node in nodes:
        # node.set_node_id(count)
        # count+=1
        print(node.get_node_id(), node.get_64bit_addr())


    return JsonResponse({"succ" : "done"})

@csrf_exempt
def toggle_pin(request):
    id = request.GET.get("id")
    status = request.GET.get("status")
    global xbee_network
    remote_node = xbee_network.get_device_by_node_id(id)
    if status == "on":
        remote_node.set_dio_value(IOLine.DIO11_PWM1, IOValue.HIGH)
    else:
        remote_node.set_dio_value(IOLine.DIO11_PWM1, IOValue.LOW)
    return JsonResponse({"succ" : "done"})

