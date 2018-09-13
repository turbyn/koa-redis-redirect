var isUrl = require('is-url');
var randomString = require("randomstring");

const redisHandler = require('./redisHandler.js');

const newLink = async (ctx, next) => {

  if(!ctx.request.body.url || !isUrl(ctx.request.body.url)){
    return ctx.status = 400
  }
    let identifier = await generateStringAndTest();

    try {
      await redisHandler.asyncAdd(identifier,ctx.request.body.url)
      ctx.status = 200
      return ctx.body = 'localhost:3000/' + identifier;
    } catch (e) {
      return ctx.status = 500
    }

}
const generateStringAndTest = async ()=>{
  return new Promise(async (resolve,reject) => {

  const identifier = randomString.generate(6);

    if(await redisHandler.asyncRead(identifier)){
      return resolve(generateStringAndTest())
    }else{
      return resolve(identifier)
      }
  })
}

const getLink = async (ctx, next) => {
  //redirect here
  console.log(ctx.params.id)
  try {
    console.log('STARTING! - async')
    let res = await redisHandler.asyncRead(ctx.params.id);
    console.log('FINISHING! - async')
    console.log('Result - '+res);
    if(res){
      ctx.redirect(res);
    }else{
      ctx.body = "Unable to find";
      ctx.status = 404;
    }
  } catch (e) {
    console.log('Err!: '+e);
    ctx.status = 500;
    ctx.body = "Internal error";
  }
}

module.exports = {
  newLink,
  getLink
}
