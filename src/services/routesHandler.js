const isUrl = require('is-url');
const randomString = require('randomstring');

const redisHandler = require('./redisHandler.js');

const newLink = async (ctx, next) => {
  const url = ctx.request.body.url

  if (!url || !isUrl(url)) {
    return ctx.status = 400;
  }
  const timeout = ctx.request.body.timeout

  if(timeout || timeout === 0){
    if(!Number.isInteger(timeout) || (timeout < 1 || timeout > 86400)){
      ctx.body = "timeout has to be integer, higher than 0 and less than 86400"
      return ctx.status = 400
    }

  const identifier = await generateStringAndTest();

  try {
    await redisHandler.asyncAdd(identifier, ctx.request.body.url, timeout);
    ctx.status = 200;
    return ctx.body = `localhost:3000/${identifier}`;
  } catch (e) {
    console.log('ERR!' + e)
    return ctx.status = 500;
  }
}
};
const generateStringAndTest = async () => new Promise(async (resolve, reject) => {
  const identifier = randomString.generate(6);

  if (await redisHandler.asyncRead(identifier)) {
    return resolve(generateStringAndTest());
  }
  return resolve(identifier);
});

const getLink = async (ctx, next) => {
  // redirect here
  console.log(ctx.params.id);
  try {
    const res = await redisHandler.asyncRead(ctx.params.id);
    if (res) {
      ctx.redirect(res);
    } else {
      ctx.body = 'Unable to find';
      ctx.status = 404;
    }
  } catch (e) {
    console.log(`Err!: ${e}`);
    ctx.status = 500;
    ctx.body = 'Internal error';
  }
};

module.exports = {
  newLink,
  getLink,
};
