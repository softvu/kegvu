const zipObject = require('lodash/zipObject');
const bluebird = require('bluebird');
const bodyParser = require('body-parser');
const express = require('express');
const redis = require('redis');
bluebird.promisifyAll(redis);

const redisClient = redis.createClient();

const app = express();
app.use(bodyParser.text());
app.use(bodyParser.json());

const expressWs = require('express-ws')(app);

app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.get('/', async (req, res) => {
  const pins = await redisClient.keysAsync('pin-*');

  const vals = await redisClient.mgetAsync(pins);

  const ret = zipObject(pins.map(x => x.replace('pin-', '')), vals);

  res.send(ret);
});

app.get('/pins', async (req, res) => {
  const pins = await redisClient.keysAsync('pin-*');

  res.send(pins.map(x => x.replace('pin-', '')));
});

app.get('/:pin', async (req, res) => {
  const pin = await redisClient.getAsync(`pin-${req.params.pin}`);

  res.send({ count: +pin });
});

app.post('/:pin', async (req, res) => {
  const key = `pin-${req.params.pin}`;

  let val;

  if (req.body && req.body.hasOwnProperty('pulses')) {
    let num = 0;
    try {
      num = parseInt(req.body.pulses, 10);
    }
    catch (e) {
      return res.status(400).send('Bad body!');
    }

    if (isNaN(num)) return res.status(400).send('Bad body!');
    await redisClient.setAsync(key, num);
    val = await redisClient.getAsync(key);
  } else {
    val = await redisClient.incrAsync(key);
  }

  await redisClient.publishAsync(key, val);

  res.send({ count: val });
});

app.post('/reset/:pin', async (req, res) => {
  const key = `pin-${req.params.pin}`;
  const val = await redisClient.setAsync(key, 0);

  redisClient.publish(key, val);

  res.send(val);
});

app.ws('/subscribe/:pin', async function(ws, req) {
  const key = `pin-${req.params.pin}`;
  const sub = redis.createClient();

  sub.on('message', (channel, message) => {
    if (ws.readyState !== 1) return;

    console.log('sending', message);

    ws.send(message);
  });

  sub.subscribe(key);

  const val = await redisClient.getAsync(key);

  ws.send(val);
});

const listener = app.listen(process.env.PORT || 3030, () => console.log(`Example app listening on http://localhost:${listener.address().port}`));
