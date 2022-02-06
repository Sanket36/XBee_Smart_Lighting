from digi.xbee.devices import XBeeDevice
from apscheduler.schedulers.background import BackgroundScheduler
from time import sleep

class CoordinatorMeta(type):
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            instance = super().__call__(*args, **kwargs)
            cls._instances[cls] = instance
        return cls._instances[cls]


class Coordinator(metaclass=CoordinatorMeta):
    CoordinatorXbee = None
    XBeeNetwork = None
    NodesList = []
    scheduler = None
    SunRise = None
    SunSet = None
    autoSchedule = [{'from': None, 'to': None, 'i': ''}, {'from': None, 'to': None, 'i': ''}, {'from': None, 'to': None, 'i': ''}, {'from': None, 'to': None, 'i': ''}, {'from': None, 'to': None, 'i': ''}]

    def startup(self):
        self.scheduler = BackgroundScheduler()
        self.CoordinatorXbee = XBeeDevice("/dev/ttyUSB0", 9600)
        self.CoordinatorXbee.open()
        self.XBeeNetwork = self.CoordinatorXbee.get_network()
        self.XBeeNetwork.start_discovery_process(deep=True, n_deep_scans=1)
        while self.XBeeNetwork.is_discovery_running():
            sleep(0.1)

        self.NodesList = self.XBeeNetwork.get_devices()
        print(self.NodesList)
