import argparse, time, sys
from datetime import datetime
import redis
# from gpiozero.pins.mock import MockFactory
from gpiozero import Button, Device, InputDevice

Device.pin_factory = MockFactory()

parser = argparse.ArgumentParser(description='Process some integers.')
parser.add_argument('pins', metavar='P', type=int, nargs='+',
                    help='A Pi pin to listen to (BOARD numbering)')
args = parser.parse_args()
print(args.pins)
quit()

r = redis.StrictRedis(host='localhost', port=6379, db=0)

PULSES_PER_LITER = 450

# pin = InputDevice(parser)
pin = Button(14)

def pressed():
    print('1', end='', flush=True)


pin.when_pressed = pressed

# last_val = None
# start = datetime.now()
# hertz = 0
# loops = 1
# pulses = 0
# lastline = ''
# while True:
#     try:
#         current_time = datetime.now()
#         secdiff = (current_time - start).seconds
#         hertz = loops / (secdiff or 1)

#         val = pin.value
#         #print(num, end='', flush=True)
#         if val is True and last_val is False:
#             pulses += 1

#         if secdiff > 0 and secdiff % 10 is 0:
#             line = 'Liters: {} [{}]'.format(pulses / PULSES_PER_LITER, pulses)
#             if line != lastline:
#                 print(line)
#                 lastline = line

#         last_val = val
#         loops = loops + 1

#         time.sleep(.001)
#     except KeyboardInterrupt:
#         print('Liters: {} [{}]'.format(pulses / PULSES_PER_LITER, pulses))
#         sys.exit()
