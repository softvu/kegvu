const zipObject = require('lodash/zipObject');
const bluebird = require('bluebird');
const express = require('express');
const redis = require('redis');
bluebird.promisifyAll(redis);

const redisClient = redis.createClient();

const app = express();

const expressWs = require('express-ws')(app);

app.get('/', async (req, res) => {
  const pins = await redisClient.keysAsync('pin-*');

  const vals = await redisClient.mgetAsync(pins);

  const ret = zipObject(pins, vals);

  res.send({ pins: ret });
});

app.get('/pins', async (req, res) => {
  const pins = await redisClient.keysAsync('pin-*');

  res.send({ pins });
});

app.get('/:pin', async (req, res) => {
  const pin = await redisClient.getAsync(`pin-${req.params.pin}`);

  res.send({ count: +pin });
});

app.post('/:pin', async (req, res) => {
  const key = `pin-${req.params.pin}`;
  const val = await redisClient.incrAsync(`pin-${req.params.pin}`);

  redisClient.publish(key, val);

  res.send({ count: val });
});

app.post('/reset/:pin', async (req, res) => {
  const key = `pin-${req.params.pin}`;
  const val = await redisClient.setAsync(key, 0);

  redisClient.publish(key, val);

  res.send(val);
});

app.ws('/subscribe/:pin', function(ws, req) {
  const key = `pin-${req.params.pin}`;
  const sub = redis.createClient();

  sub.on('message', async (channel, message) => {
    ws.send(message);
  });

  sub.subscribe(key);
});

const listener = app.listen(process.env.PORT || 3030, () => console.log(`Example app listening on http://localhost:${listener.address().port}`));
