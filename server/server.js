'use static';

const http = require('http');

const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const koaStatic = require('koa-static');

const config = require('./config.js');
const router = require('./router/route');
const page404 = require('./router/404');
const usoApi = require('./router/usoApiRouter');

const app = new Koa();

app.use(koaStatic(__dirname + '/static'));

// 加载 koa-bodyparser 中间件，处理 POST 提交信息
app.use(bodyParser());

// 加载路由中间件
app.use(router.routes()).use(router.allowedMethods());

// 加载 404 中间件
app.use(page404());

// 加载 虚假接口中间件
app.use(usoApi());

http.createServer(app.callback()).listen(config.PORT, '0.0.0.0');
console.info(`running mode type ${config.NODE_ENV}`);
console.info(`http server is running http://localhost:${config.PORT}`);
