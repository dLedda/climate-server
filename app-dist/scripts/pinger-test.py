from datetime import datetime
import random

print(
    'Time:', str(datetime.isoformat(datetime.utcnow())) + "Z",
    '\nTemp:', random.randint(0, 40),
    '\nHumidity:', random.randint(50, 80),
    '\nCO2:', random.randint(400, 1200),
    sep='\t',
)