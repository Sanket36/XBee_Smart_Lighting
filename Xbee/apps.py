from django.apps import AppConfig
from .Coordinator import Coordinator
from digi.xbee.io import IOLine, IOMode



class XbeeConfig(AppConfig):
    name = 'Xbee'

    def ready(self):
        Coordinator().startup()

        from .models import Node
        from Scheduler import updater
        from Scheduler.jobs import fetchSunModel
        for node in Coordinator().NodesList:
            node.set_io_configuration(IOLine.DIO0_AD0, IOMode.ADC)
            node.set_io_configuration(IOLine.DIO1_AD1, IOMode.ADC)
            node.set_sync_ops_timeout(10)
            if not Node.objects.filter(HexAddr=node.get_64bit_addr()).exists():
                Node.objects.create(NodeId=node.get_node_id(), HexAddr=node.get_64bit_addr())

        fetchSunModel()
        updater.start()
