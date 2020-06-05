'use static';

const Route = require('koa-router');
const API = require('../mongo/util/apiList');

// API -----------------------------------------
const usoDataApi = new Route();

usoDataApi.get('/findOne', async ctx => {
  try {
    console.log(ctx.query);
    ctx.body = await API.dataFindOne(ctx.query);
  } catch (err) {
    ctx.throw(500, err);
  }
});

usoDataApi.get('/find', async ctx => {
  try {
    console.log(ctx.query);
    ctx.body = await API.dataFind(ctx.query);
  } catch (err) {
    ctx.throw(500, err);
  }
});

usoDataApi.post('/create', async ctx => {
  try {
    console.log(ctx.request.body);
    ctx.body = await API.dataInsert(ctx.request.body);
  } catch (err) {
    ctx.throw(500, err);
  }
});

usoDataApi.put('/edit', async ctx => {
  try {
    console.log(ctx.request.body);
    ctx.body = await API.dataChange(ctx.request.body);
  } catch (err) {
    ctx.throw(500, err);
  }
});

usoDataApi.delete('/delete', async ctx => {
  try {
    console.log(ctx.query);
    ctx.body = await API.dataDelete(ctx.query);
  } catch (err) {
    ctx.throw(500, err);
  }
});

module.exports = usoDataApi;
