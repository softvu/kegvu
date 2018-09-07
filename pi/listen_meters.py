import argparse, time, sys
from datetime import datetime
import redis
from gpiozero import Button, Device, InputDevice
from signal import pause

PULSES_PER_LITER = 450

parser = argparse.ArgumentParser(description='Process some integers.')
parser.add_argument('pins', metavar='P', type=int, nargs='+',
                    help='A Pi pin to listen to (BCM numbering)')
args = parser.parse_args()
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
            print('key', key, val)

    return handler

button1 = Button(pins[0])
button2 = Button(pins[1])

button1.when_pressed = pressed(pins[0])
button2.when_pressed = pressed(pins[1])

print('Listening on pins: {}...'.format(', '.join(str(p) for p in pins)))

pause()