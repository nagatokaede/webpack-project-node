'use static';

const config = require('../config.js');
const path = require('path');
const Route = require('koa-router');
const { leaveMessageInsert, leaveMessageDelete, leaveMessageFindByPage} = require('../mongo/util/leaveMessage');
const USER = require('../mongo/util/user');
const API = require('../mongo/util/apiList');
const { informationStatisticsInsert, informationStatisticsDelete, informationStatisticsFindByPage } = require('../mongo/util/informationStatistics');
const insSpider = require('../util/spider/bin/spider');
const uploadFile = require('../util/fs/upload');
const OSS = require('../util/OSS');
const usoDataApi = require('./usoDataApiRouter');


// information statistics API --------------------------------
const informationStatistics = new Route();

informationStatistics.get('/', async ctx => {
  try {
    ctx.body = await informationStatisticsFindByPage(ctx.query);
  } catch (err) {
    ctx.throw(500, err);
  }
});

informationStatistics.post('/', async ctx => {
  try {
    ctx.body = await informationStatisticsInsert(ctx.request.body);
  } catch (err) {
    ctx.throw(500, err);
  }
});

informationStatistics.put('/', async ctx => {
  try {
    ctx.body = await informationStatisticsDelete(ctx.request.body);
  } catch (err) {
    ctx.throw(500, err);
  }
});

// leave message API -----------------------------------------
const leaveMessage = new Route();

leaveMessage.get('/', async ctx => {
  console.log(ctx.path);
  try {
    ctx.body = await leaveMessageFindByPage(ctx.query);
  } catch (err) {
    ctx.throw(500, err);
  }
});

leaveMessage.post('/', async ctx => {
  try {
    ctx.body = await leaveMessageInsert(ctx.request.body);
  } catch (err) {
    ctx.throw(500, err);
  }
});

leaveMessage.put('/', async ctx => {
  try {
    ctx.body = await leaveMessageDelete(ctx.request.body);
  } catch (err) {
    ctx.throw(500, err);
  }
});

// user API -----------------------------------------
const user = new Route();

user.post('/login', async ctx => {
  try {
    ctx.body = await USER.userLogin(ctx.request.body);
  } catch (err) {
    ctx.throw(500, err);
  }
});

user.post('/register', async ctx => {
  try {
    ctx.body = await USER.userInsert(ctx.request.body);
  } catch (err) {
    ctx.throw(500, err);
  }
});

user.put('/changePassword', async ctx => {
  try {
    ctx.body = await USER.userChangePassword(ctx.request.body);
  } catch (err) {
    ctx.throw(500, err);
  }
});

user.put('/userDelete', async ctx => {
  try {
    ctx.body = await USER.userDelete(ctx.request.body);
  } catch (err) {
    ctx.throw(500, err);
  }
});

// instagram spider ------------------------------------------
const instagramSpider = new Route();

instagramSpider.post('/', async ctx => {
  try {
    ctx.body = await insSpider(ctx.request.body.url);
  } catch (err) {
    ctx.throw(500, err);
  }
});

// upload api ------------------------------------------------
const upload = new Route();

upload.post('/', async ctx => {
  // 上传文件请求处理
  let result = { success: false };
  let serverFilePath = path.join(__dirname, '../static/images');
  try {
    // 上传文件事件
    result = await uploadFile( ctx, {
      fileType: 'photo',
      path: serverFilePath
    });
    ctx.body = result
  } catch (err) {
    ctx.throw(500, err);
  }
});

// OSS api ----------------------------------------------------
const aLiYunOSS = new Route();

aLiYunOSS.get('/getStsToken', async ctx => {
  try {
    // // 获取用户权限
    const userInfo = await USER.userFindOne('nagato');
    // 判断用户状态
    if (userInfo.description === 'DEFEAT') ctx.body = userInfo;
    // 获取 sts token
    const token = await OSS.assumeRole(config.RoleArn, config.Policy, config.Expiration, config.SessionName);
    token.BucketName = userInfo.data.bucketName;
    ctx.body = token;
  } catch (err) {
    ctx.throw(500, err);
  }
});

aLiYunOSS.get('/getDirList', async ctx => {
  console.log(ctx.query);
  try {
    // 获取用户权限
    const userInfo = await USER.userFindOne('nagato');
    // 判断用户状态
    if (userInfo.description === 'DEFEAT') ctx.body = userInfo;
    // 查询用户权限下的 OSS
    ctx.body = await OSS.getDirList(userInfo.data.bucketName, JSON.parse(ctx.query.params));
  } catch (err) {
    ctx.throw(500, err);
  }
});

aLiYunOSS.post('/putStream', async ctx => {
  try {
    // 获取用户权限
    const userInfo = await USER.userFindOne('nagato');
    // 判断用户状态
    if (userInfo.description === 'DEFEAT') ctx.body = userInfo;
    // 参数校验
    const { fileName, stream, size } = ctx.query;
    if (!fileName) ctx.throw(400, '{"data":{"message":"重要参数缺失"},"description":"DEFEAT"}');
    console.log(fileName, stream, size);
    // 流上传
    // let stream = fs.createReadStream('local-file');
    ctx.body = await OSS.putStream(userInfo.data.bucketName, fileName, stream, size);

    ctx.body = fileName;
  } catch (err) {
    ctx.throw(500, err);
  }
});

aLiYunOSS.post('/multipartUpload', async ctx => {
  try {
    ctx.body = await OSS.multipartUpload(ctx.query);
  } catch (err) {
    ctx.throw(500, err);
  }
});

// API -----------------------------------------
const api = new Route();

api.get('/findOne', async ctx => {
  try {
    console.log(ctx.query);
    ctx.body = await API.apiFindOne(ctx.query);
  } catch (err) {
    ctx.throw(500, err);
  }
});

api.get('/find', async ctx => {
  try {
    console.log(ctx.query);
    ctx.body = await API.apiFind(ctx.query);
  } catch (err) {
    ctx.throw(500, err);
  }
});

api.post('/create', async ctx => {
  try {
    console.log(ctx.request.body);
    ctx.body = await API.apiInsert(ctx.request.body);
  } catch (err) {
    ctx.throw(500, err);
  }
});

api.put('/edit', async ctx => {
  try {
    console.log(ctx.request.body);
    ctx.body = await API.apiChange(ctx.request.body);
  } catch (err) {
    ctx.throw(500, err);
  }
});

api.delete('/delete', async ctx => {
  try {
    console.log(ctx.query);
    ctx.body = await API.apiDelete(ctx.query);
  } catch (err) {
    ctx.throw(500, err);
  }
});

// 装载所有路由接口 ---------------------------------------------
const router = new Route();
router.use('/usoDataApi', usoDataApi.routes(), usoDataApi.allowedMethods());
router.use('/api', api.routes(), api.allowedMethods());
router.use('/oss', aLiYunOSS.routes(), aLiYunOSS.allowedMethods());
router.use('/upload', upload.routes(), upload.allowedMethods());
router.use('/instagramSpider', instagramSpider.routes(), instagramSpider.allowedMethods());
router.use('/leaveMessage', leaveMessage.routes(), leaveMessage.allowedMethods());
router.use('/informationStatistics', informationStatistics.routes(), informationStatistics.allowedMethods());
router.use('/user', user.routes(), user.allowedMethods());

module.exports = router;
