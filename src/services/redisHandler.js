var redis = require('redis');
var client = redis.createClient();

client.on('connect', function() {
    console.log('connected');
});

client.on("error", function (err) {
    console.log("Error " + err);
    console.log(err);
});

const asyncAdd = (key, value) => {
  return new Promise((resolve, reject) => {
    client.set(key, value, function(err, reply) {
      console.log('Result of reading')
      console.log('Error:')
      console.log(err)
      console.log('Reply:');
      console.log(reply);
      if(err){return reject(err)}
      resolve(reply)
    });
  })
}

const asyncRead = (key) => {
  return new Promise((resolve,reject) => {
    client.get(key, function(err, reply) {
      console.log('Result of reading')
      console.log('Error:')
      console.log(err)
      console.log('Reply:');
      console.log(reply);
      if(err){return reject(err)}
      resolve(reply)
    });
  })
}

module.exports = {
  asyncAdd,
  asyncRead
}
