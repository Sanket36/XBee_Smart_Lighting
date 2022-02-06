from .models import *
from digi.xbee.io import IOLine
from .Coordinator import Coordinator

def getInsValue():
    nodes = Node.objects.all()

    if nodes:
        for node in nodes:
            remote_node = Coordinator().XBeeNetwork.get_device_by_node_id(node.NodeId)
            if remote_node is not None:
                temp = remote_node.get_adc_value(IOLine.DIO0_AD0)
                print(temp)
                # curr = remote_node.get_adc_value(IOLine.DIO1_AD1)
                # conversion
                temp = ((temp * 120 / 1023) - 50)

                InsValue.objects.create(NodeId=node, CurrValue=50, TempValue=temp)

