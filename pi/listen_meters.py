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

buttons = [Button(args[0]), Button(args[1])]

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
            print('key', key, val)

    return handler

# for pin in pins:
for button in buttons:
    print(button)
    continue
    # pinButton = Button(pin)
    # button.when_pressed = pressed(pin)

    # print('Listening on pin {}...'.format(pin))

pause()