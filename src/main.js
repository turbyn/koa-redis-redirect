var Koa = require('koa');
var Router = require('koa-router');
var bodyParser = require('koa-bodyparser');



const routesHandler = require('./services/routesHandler.js')
var app = new Koa();
var router = new Router();
app.use(bodyParser());


router.post('/api/new', routesHandler.newLink)

router.get('/:id', routesHandler.getLink);

app
  .use(router.routes())
  .use(router.allowedMethods())
  .listen(3000);


// IDEA: -time sensitive
//       -rate limiter
