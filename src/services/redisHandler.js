const redis = require('redis');

const client = redis.createClient(process.env.REDIS_URL);

let fs = require('fs')
let nconf = require('nconf');
nconf.use('file', {file: './config.json' } )



client.on('connect', () => {
  console.log('connected');
});

client.on('error', (err) => {
  console.log(`Error ${err}`);
  console.log(err);
});

const asyncAdd = (key, value, timeout) => new Promise((resolve, reject) => {
  let defaultTimeout = 60*10;
  if(timeout){defaultTimeout=timeout}
  client.set(key, value, 'EX', defaultTimeout, (err, reply) => {
    if (err) { return reject(err); }
    resolve(reply);
  });
});

const asyncRead = key => new Promise((resolve, reject) => {
  client.get(key, (err, reply) => {
    if (err) { return reject(err); }
    resolve(reply);
  });
});

module.exports = {
  asyncAdd,
  asyncRead,
};
