const redis = require('redis');

const client = redis.createClient(process.env.REDIS_URL);

client.on('connect', () => {
  // eslint-disable-next-line
  console.log('Connected');
});

client.on('error', (err) => {
  // eslint-disable-next-line
  console.log(`ERR! ${err}`);
});

const asyncAdd = (key, value, timeout) => new Promise((resolve, reject) => {
  let defaultTimeout = 60 * 10;
  if (timeout) { defaultTimeout = timeout; }
  // eslint-disable-next-line
  client.set(key, value, 'EX', defaultTimeout, (err, reply) => {
    if (err) { return reject(err); }
    resolve(reply);
  });
});

const asyncRead = key => new Promise((resolve, reject) => {
  // eslint-disable-next-line
  client.get(key, (err, reply) => {
    if (err) { return reject(err); }
    resolve(reply);
  });
});

module.exports = {
  asyncAdd,
  asyncRead,
};
