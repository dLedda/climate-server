# Climate Dashboard and Server

## Requirements
Linux packages (apt)
> python3 libgpiod2 npm mariadb-server

Python3 packages (pip3)
> adafruit-circuitpython-dht mh-z19

The setup script installs these for you.

## Setup

1. Pull the repository.
1. Fill out your specific config options in `./server/.env`
1. Ensure `./app-dist/scripts/climate-pinger.py` has the correct pin for your adafruit-dht22 device and/or edit the script for your specific setup.
1. Run `./setup.sh` as administrator
1. Start the server: 
   > node ./app-dist/main.js

## Usage

In the following, a datetime parameter is always a unix timestamp in milliseconds and an ISO string in UTC. 

### Dashboard:

- `GET  /dashboard`
    - Display the dashboard page, by default the chart will show the last 60 minutes, updating every 30 seconds.
    
    Available parameters:
      
    | Name | Type | Usage |
    |--------|------|---------|
    | last-minutes | number | alone, in order to start with a display of snapshots from the last number of minutes specified, auto-updating.|
    | from | datetime | alone or with `to` in order to start with a display of snapshots beginning at the datetime specified. If `to` is not specified it will default to the current time.|
    | to | datetime | always with `from` in order to start with a display of snapshots until the datetime specified|

### API:

All API endpoints that return a snapshot can specify the `timeFormat` parameter, with the value `unix` or `iso` to override default behaviour.

A request to the API whose parameters are all given in a particular time format (either an ISO string or a unix timetamp) are all consistent will always return with all timestamps in the corresponding format unless the request specifies the "timeFormat" parameter to override. 
If the request has mixed use of the time formats, the default will be an ISO string in UTC.  


- `GET  /api/snapshots`
    - Retrieve a json of data snapshots over the last 60 minutes in the following format:

    ```json
    {
      "snapshots": [
        {
          "id": 8868,
          "time": "2020-11-13T20:00:12Z", // iso string OR unix timestamp e.g. 1615015310862
          "temp": 21.7, // number, expressed in degrees celsius
          "humidity": 57.3, // number, expressed in %
          "co2": 958 // number, expressed in ppm
        },
        {
          "id": 8867,
          "time": "2020-11-13T19:59:42Z",
          "temp": 21.7,
          "humidity": 57.3,
          "co2": 957
        },
        // ...
      ]
    } 
    ```
  Snapshots are ordered descending.
  
  Available parameters:
  
    | Name | Type | Usage |
    |--------|------|---------|
    | last-minutes | number | alone, in order to return snapshots from the last number of minutes specified|
    | from | datetime | alone or with `to` in order to return snapshots within a range|
    | to | datetime | always with `from` in order to return snapshots within a range|
    | time-format | string: `unix` or `iso` | optional usage, default is 'iso', if set will override the inferred format from `from` and `to`

  Example:

    `GET http://<host>/<project-root>/api/snapshots?from=2021-03-06T07:21:50.862Z&to=1615015610862`

- `GET  /api/snapshots/latest`
    - In the same format as above, but the snapshots array will only contain the most recent snapshot.
    - Clearly, the since, from and to parameters have no effect here.

- `POST /api/snapshots`
    - Submit one or more snapshots to the database in the format of the following example JSON: 
    
    ```json
    {
      snapshots: [
        {
          "time": "2020-11-13T22:20:44Z", // iso string OR unix timestamp e.g. 1615015310862
          "temp": 25.2, // number, expressed in degrees celsius
          "humidity": 65.4,  // number, expressed in %
          "co2": 450 // number, expressed in ppm
        },
        // ...
      ]
    }
    ```
- `GET /api/timeseries/<data-type>`
  - This endpoint returns an octet stream of 32 bit integers. `data-type` must be `co2`, `temp`, or `humidity`. The integer stream is an alternating array of data points and unix timestamps.

  - Available parameters
  
  | Name | Type | Usage |
  |--------|------|---------|
  | last-minutes | number | alone, in order to return snapshots from the last number of minutes specified|
  | from | datetime | alone or with `to` in order to return snapshots within a range|
  | to | datetime | always with `from` in order to return snapshots within a range|
  
### Sensor script:

The script in `./app-dist/scripts/climate-pinger.py` is provided as an example. You can replace this script with your own, provided it outputs in the following format:
```
Time:   <time as iso string>
Temp:   <temp>
Humidity:   <humidity>
CO2:    <co2>
```
with label and data separated by tabs.   