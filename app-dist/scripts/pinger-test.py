from datetime import datetime

print(
    'Time:', str(datetime.isoformat(datetime.now())),
    '\nTemp:', 20,
    '\nHumidity:', 60,
    '\nCO2:', 500,
    sep='\t',
)