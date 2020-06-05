'use static';

const API = require('../mongo/util/apiList');

/**
 * 获取 url 中的 uri 与 query 请求参数
 * @param {string} url - 代理请求 url
 * @return {object} - { uri, params }
 */
function getUrlParam(url) {
  const regList = url.match(/[^(?|&)]*/g).filter(item => item);

  const uri = regList.shift();

  const params = regList.reduce((pre, cur) => {
    const [ key, value ] = cur.split('=');
    pre[key] = value;
    return pre;
  }, {});

  return { uri, params };
}

/**
 * 拼接 uri 与 query 请求参数
 * @param {string} uri - 代理请求资源路径
 * @param {object} params - query 请求入参
 * @return {string} - url
 */
function recombineUriParam(uri, params) {
  return Object.entries(params)
    .reduce((pre, [ key, val ]) => pre + `${key}=${val}&`, uri + '?')
    .slice(0, -1);
}

function responseDataModel(flag, data, message) {
  const content = {
    data: {},
    description: '',
  };
  if (flag) {
    content.description = 'SUCCESS';
    content.data = data;
  } else {
    console.warn('message: ' + data);
    content.description = 'DEFEAT';
    content.data.data = data;
    content.data.message = message;
  }
  return content;
}

function FindApi(type, uri) {
  return new Promise((resolve, reject) => {
    API.apiFindOne({type, uri}).then(res => {
      resolve(res);
    }).catch(err => {
      reject(err);
    });
  });
}

function ParameterCalibration(ctx, Parameter) {
  let query = [], body = [];

  if (Parameter.query) {
    const keys = new Set(Object.keys(ctx.query));

    query = new Set([...Parameter.query].filter(x => !keys.has(x)));
  }

  if (Parameter.body) {
    const keys = new Set(Object.keys(ctx.request.body));

    body = new Set([...Parameter.body].filter(x => !keys.has(x)));
  }

  let union = new Set([...query, ...body]);

  if (union.size) {
    return responseDataModel(false, [...union], '必要参数缺失');
  }
}

function UsoApi (ctx) {
  return new Promise((resolve, reject) => {
    const { uri } = getUrlParam(ctx.url);
    FindApi(ctx.method, uri.split('/usoApi')[1]).then(res => {
      if (res.description === 'SUCCESS') {
        const check = ParameterCalibration(ctx, res.data);
        if (!check) {
          if (res.data.isList) {
            API.dataFind({apiId: res.data._id}).then(dataRes => {
              resolve(dataRes);
            });
          } else {
            API.dataFindOne({apiId: res.data._id}).then(dataRes => {
              resolve(dataRes.data.data);
            });
          }
        } else {
          resolve(check);
        }
      } else {
        resolve(res);
      }
    }).catch(err => {
      reject(err);
    });
  });
}

module.exports = () => {
  return async (ctx, next) => {
    if (ctx.url.includes('/usoApi')) {
      try {
        console.log(ctx.method, ctx.url.split('/usoApi')[1]);
        ctx.body = await UsoApi(ctx);
      } catch (err) {
        ctx.throw(500, err);
      }
    }
    await next();
  }
};
