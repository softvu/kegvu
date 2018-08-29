const zipObject = require('lodash/zipObject');
const bluebird = require('bluebird');
const express = require('express');
const redis = require('redis');
bluebird.promisifyAll(redis);

const redisClient = redis.createClient();

const app = express();

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
  const val = await redisClient.incrAsync(`pin-${req.params.pin}`);

  res.send({ count: val });
});

app.post('/reset/:pin', async (req, res) => {
  const val = await redisClient.setAsync(`pin-${req.params.pin}`, 0);

  res.send(val);
});

const listener = app.listen(process.env.PORT || 3030, () => console.log(`Example app listening on http://localhost:${listener.address().port}`));
