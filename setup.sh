#!/bin/sh

apt-get install python3 libgpiod2 npm mariadb-server
pip3 install adafruit-circuitpython-dht mh-z19
npm install
(cd ./server && npm install && tsc) & (cd ./dashboard && npm install && npm run build)
