import RPi.GPIO as GPIO
import time, sys
from datetime import datetime

PULSES_PER_LITER = 450

GPIO.setmode(GPIO.BOARD)
GPIO.setup(8, GPIO.IN)

last_num = None
start = datetime.now()
hertz = 0
loops = 1
pulses = 0
lastline = ''
while True:
    try:
        current_time = datetime.now()
        secdiff = (current_time - start).seconds
        hertz = loops / (secdiff or 1)

        num = GPIO.input(8)
        #print(num, end='', flush=True)
        time.sleep(.1)
        if num is 1 and last_num is 0:
            pulses += 1

        if secdiff > 0 and secdiff % 10 is 0:
            line = 'Liters: {}'.format(pulses / PULSES_PER_LITER)
            if line != lastline:
                print(line)
                lastline = line

        last_num = num
        loops = loops + 1
    except KeyboardInterrupt:
        GPIO.cleanup()
        sys.exit()