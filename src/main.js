var Koa = require('koa');
var Router = require('koa-router');
var bodyParser = require('koa-bodyparser');
var isUrl = require('is-url');
var randomString = require("randomstring");


const redisHandler = require('./services/redisHandler.js');

var app = new Koa();
var router = new Router();
app.use(bodyParser());


router.post('/api/new', async (ctx, next) => {

  if(!ctx.request.body.url || !isUrl(ctx.request.body.url)){
    return ctx.status = 400
  }

  const identifier = randomString.generate(6);
  if(await redisHandler.asyncRead(identifier)){
    //TODO: Add duplicate handling (possible solution - move to separate function and use recursion)
  }else{
    //Not found, save and serve
    try {
      await redisHandler.asyncAdd(identifier,ctx.request.body.url)
      ctx.status = 200
      return ctx.body = 'localhost:3000/' + identifier;
    } catch (e) {
      return ctx.status = 500
    }
  }
})

router.get('/:id', async (ctx, next) => {
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
});

app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000);


// IDEA: -time sensitive
//       -rate limiter
