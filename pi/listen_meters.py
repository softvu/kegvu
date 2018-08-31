import argparse, time, sys
from datetime import datetime
import redis
from gpiozero import Button, Device, InputDevice
from signal import pause

PULSES_PER_LITER = 450

parser = argparse.ArgumentParser(description='Process some integers.')
parser.add_argument('pins', metavar='P', type=int, nargs='+',
                    help='A Pi pin to listen to (BOARD numbering)')
args = parser.parse_args()
# print(args.pins)
# quit()
pins = args.pins

r = redis.StrictRedis(host='localhost', port=6379, db=0)

def pressed(pin):
    def handler():
        key = 'pin-{}'.format(pin)
        # r.incr(key)
        # val = r.get(key)
        # r.publish(key, val)
        with r.pipeline() as pipe:
            pipe.watch(key)
            pipe.incr(key)
            val = pipe.get(key)
            pipe.publish(key, val)
            pipe.execute()

    return handler

for pin in pins:
    pinButton = Button(pin)
    pinButton.when_pressed = pressed(pin)

    print('Listening on pin {}...'.format(pin))

pause()

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
