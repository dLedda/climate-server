#!/usr/bin/python3

import adafruit_dht
import mh_z19
import sys
from board import D4
from datetime import datetime

try:
    dhtDevice = adafruit_dht.DHT22(D4)
    temp = dhtDevice.temperature
    humidity = dhtDevice.humidity
    co2 = mh_z19.read()
    if co2 is not None:
        co2 = co2['co2']
    else:
        raise RuntimeError()
    print(
        'Time:', str(datetime.isoformat(datetime.now())),
        '\nTemp:', temp,
        '\nHumidity:', humidity,
        '\nCO2:', co2,
        sep='\t',
    )
except Exception as error:
    print('err:', error, file=sys.stderr)

sys.stdout = None
dhtDevice.exit()
