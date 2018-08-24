import random
import sys

PULSES_PER_LITER = 450
PINTS_PER_LITER = 2.11338

pulses = 0

def get_pulse():
  return random.randint(0, 1)

def print_stats():
  print(f'\nPulses: {pulses}', flush=True)
  print('Liters: {}'.format(pulses / PULSES_PER_LITER))
  print('Pints: {}'.format(pulses / PULSES_PER_LITER * PINTS_PER_LITER))

last_num = 0
while True:
  try:
    num = get_pulse()

    print(num, end='', flush=True)

    if last_num is 0 and num is 1:
      pulses = pulses + 1

    last_num = num
  except KeyboardInterrupt:
    print_stats()
    print('Exiting...')
    sys.exit(0)