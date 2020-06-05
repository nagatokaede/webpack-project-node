'use static';

const { apiModel, apiHistoryModel, apiDataModel } = require('../modules/apiList');

const responseDataModel = (flag, data, message) => {
  const content = {
    data: {},
    description: '',
  };
  if (flag) {
    content.description = 'SUCCESS';
    content.data = data;
  } else {
    console.warn('message' + data);
    content.description = 'DEFEAT';
    content.data = data;
    content.data.message = message;
  }
  return content;
};

/**
 * ------- 用户操作记录表 ---------
 * body {
 *   apiId: <_id> 用户 _id
 *   updateBy: <string> 修改者
 *   updateInfo: <string> 修改信息
 * }
 */
const apiHistoryInsert = body => {
  return new Promise((resolve, reject) => {
    const createApiHistory = new apiHistoryModel(body);
    createApiHistory.save(err => { // 保存数据
      if (err) {
        reject(responseDataModel(false, { err: err }, '操作记录失败'));
      } else {
        resolve(responseDataModel(true, { data: createApiHistory}));
      }
    });
  });
};

/**
 * -------- 查询单个 api ----------
 * body
 */
const apiFindOne = body => {
  return new Promise((resolve, reject) => {
    apiModel.findOne(Object.assign(body, { delete: false })).
    then(docs => {
      // console.log(docs);
      let status = 0;
      if (!docs) {
        status = 1;
        docs = 'api 不存在！';
      } else if (docs.delete) {
        status = 2;
        docs = 'api 已删除！';
      }
      if (status) {
        resolve(responseDataModel(false, { status: status }, docs));
      } else {
        resolve(responseDataModel(true, docs));
      }
    }).
    catch(err => {
      console.warn(err);
      reject(responseDataModel(false, { err: err }, 'api 查询失败！'));
    });
  });
};

/**
 * -------- 查询多个 api ----------
 * body {
 *   type: <String> 请求类型 GET POST PUT DELETE
 *   uri: <String> 请求路径
 * }
 */
const apiFind = body => {
  return new Promise((resolve, reject) => {
    let pageIndex = 1, pageSize = 10, params = {};
    for (const [ key, val ] of Object.entries(body)) {
      switch (key) {
        case 'pageIndex':
          pageIndex = parseInt(val);
          break;
        case 'pageSize':
          pageSize = parseInt(val);
          break;
        default:
          params[key] = val;
      }
    }

    Promise.all([
      apiModel.count(Object.assign(params, { delete: false })),
      apiModel.find(Object.assign(params, { delete: false })).skip((pageIndex - 1) * pageSize ).limit(pageSize)
    ]).then(([ count, docs ]) => {
      // console.log(docs);
      let status = 0;
      if (!docs) {
        status = 1;
        docs = 'api 不存在！';
      } else if (docs.delete) {
        status = 2;
        docs = 'api 已删除！';
      }
      if (status) {
        resolve(responseDataModel(false, { status: status }, docs));
      } else {
        resolve(responseDataModel(true, {
          pageData: docs,
          totalCount: Math.floor(count / pageSize),
          pageIndex,
          pageSize,
        }));
      }
    }).
    catch(err => {
      console.warn(err);
      reject(responseDataModel(false, { err: err }, 'api 查询失败！'));
    });
  });
};

/**
 * ------- 创建 api ---------
 * body {
 *   type: <String> 请求类型 GET POST PUT DELETE
 *   uri: <String> 请求路径
 *   query: <Object> query 参数
 *   body: <Object> body 参数
 *   remark: <String> 备注
 * }
 */
const apiInsert = body => {
  return new Promise((resolve, reject) => {
    // 查找 api
    apiFindOne({ type: body.type, uri: body.uri }).
    then(res => {
      console.log(res);
      if (res.data.status === 1) {
        // 创建 api 数据
        const createApi = new apiModel(body);
        // 保存数据
        createApi.save(err => {
          if (err) {
            reject(responseDataModel(false, { err: err }, '新增 api 失败！'));
          } else {
            // 记录操作历史
            apiHistoryInsert({
              apiId: createApi._id,
              // updateBy: apiCreate.apiName,
              updateInfo: '新增 api'
            }).then(() => {
              resolve(responseDataModel(true, { message: '新增 api 成功！' }));
            }).catch((err) => {
              reject(err);
            });
          }
        });
      } else {
        resolve(res);
      }
    }).
    catch(err => {
      reject(err);
    });
  });
};

/**
 * ------- 修改 api ---------
 * body {
 *   id: <String> 数据库查询 _id
 *   type: <String> 请求类型 GET POST PUT DELETE
 *   uri: <String> 请求路径
 *   query: <Object> query 参数
 *   body: <Object> body 参数
 *   remark: <String> 备注
 * }
 */
const apiChange = body => {
  return new Promise((resolve, reject) => {
    // 查找 api
    apiFindOne({ type: body.type, uri: body.uri }).
    then(res => {
      const id = body.id;
      delete body.id;
      const _id = res.data._id || '';
      if (!res.status && _id.toString() === id || res.status === 1) {
        apiModel.updateOne(
          {_id: id},
          {$set: body}
        ).
        then(() => {
          // 记录操作历史
          apiHistoryInsert({
            apiId: res.data._id,
            // updateBy: res.data.apiName,
            updateInfo: '修改 api'
          }).then(() => {
            resolve(responseDataModel(true, { message: '修改 api 成功' }));
          }).catch(err => {
            reject(err);
          });
        }).
        catch(err => {
          reject(responseDataModel(false, { err: err }, '修改 api 失败'));
        });
      } else {
        resolve(res);
      }
    }).
    catch(err => {
      reject(err);
    });
  });
};

/**
 * ------- 删除 api ---------
 * body: {
 *   id: <String> 数据库查询 _id
 *   updateBy: <String> 修改者
 * }
 */
const apiDelete = body => {
  return new Promise((resolve, reject) => {
    // 删除 api
    apiModel.updateOne(
      {_id: body.id},
      {$set: { 'delete': true }}
    ).
    then(() => {
      // 记录操作历史
      apiHistoryInsert({
        apiId: body.id,
        // updateBy: body.createBy,
        updateInfo: '删除 api'
      }).then(() => {
        resolve(responseDataModel(true, { message: '删除 api 成功' }));
      }).catch(err => {
        reject(err);
      });
    }).
    catch(err => {
      reject(responseDataModel(false, { err: err }, '删除 api 失败'));
    });
  });
};




/**
 * -------- 查询单条数据 ----------
 * body {
 *   id
 * }
 */
const dataFindOne = body => {
  return new Promise((resolve, reject) => {
    apiDataModel.findOne(Object.assign(body, { delete: false })).
    then(docs => {
      let status = 0;
      if (!docs) {
        status = 1;
        docs = '数据不存在！';
      } else if (docs.delete) {
        status = 2;
        docs = '数据已删除！';
      }
      if (status) {
        resolve(responseDataModel(false, { status: status }, docs));
      } else {
        resolve(responseDataModel(true, docs));
      }
    }).
    catch(err => {
      console.warn(err);
      reject(responseDataModel(false, { err: err }, '数据查询失败！'));
    });
  });
};

/**
 * -------- 查询多条数据 ----------
 * body {
 *   id
 * }
 */
const dataFind = body => {
  return new Promise((resolve, reject) => {
    let pageIndex = 1, pageSize = 10, params = {};
    for (const [ key, val ] of Object.entries(body)) {
      switch (key) {
        case 'pageIndex':
          pageIndex = parseInt(val);
          break;
        case 'pageSize':
          pageSize = parseInt(val);
          break;
        default:
          params[key] = val;
      }
    }

    Promise.all([
      apiDataModel.count(Object.assign(params, { delete: false })),
      apiDataModel.find(Object.assign(params, { delete: false })).select({ data: 1 })
        .skip((pageIndex - 1) * pageSize ).limit(pageSize)
    ]).then(([ count, docs ]) => {
      // console.log(docs);
      let status = 0;
      if (!docs) {
        status = 1;
        docs = '数据不存在！';
      } else if (docs.delete) {
        status = 2;
        docs = '数据已删除！';
      }
      if (status) {
        resolve(responseDataModel(false, { status: status }, docs));
      } else {
        resolve(responseDataModel(true, {
          pageData: docs.map(item => {
            item.data.dataId = item._id;
            return item.data;
          }),
          totalCount: Math.floor(count / pageSize),
          pageIndex,
          pageSize,
        }));
      }
    }).
    catch(err => {
      console.warn(err);
      reject(responseDataModel(false, { err: err }, '数据查询失败！'));
    });
  });
};

/**
 * ------- 插入数据 ---------
 * body {
 *   apiId: <String>
 *   data: <Array>
 * }
 */
const dataInsert = body => {
  return new Promise((resolve, reject) => {
    // 查找 api
    dataFindOne({ _id: body.apiId }).
    then(res => {
      if (res.data.status === 1) {
        // 创建 api 数据
        const createData = new apiDataModel(body);
        // 保存数据
        createData.save(err => {
          if (err) {
            reject(responseDataModel(false, { err: err }, '新增数据失败！'));
          } else {
            // 记录操作历史
            apiHistoryInsert({
              apiId: createData._id,
              // updateBy: apiCreate.apiName,
              updateInfo: '新增数据'
            }).then(() => {
              resolve(responseDataModel(true, { message: '新增数据成功！' }));
            }).catch((err) => {
              reject(err);
            });
          }
        });
      } else {
        resolve(res);
      }
    }).
    catch(err => {
      reject(err);
    });
  });
};

/**
 * ------- 修改数据 ---------
 * body {
 *   apiId: <String>
 *   data: <Array>
 * }
 */
const dataChange = body => {
  return new Promise((resolve, reject) => {
    // 查找 api
    dataFindOne({ _id: body.dataId }).
    then(res => {
      const id = body.id;
      if (!res.status) {
        apiModel.updateOne(
          {_id: id},
          {$set: { data: body.data }}
        ).
        then(() => {
          // 记录操作历史
          apiHistoryInsert({
            apiId: res.data._id,
            // updateBy: res.data.apiName,
            updateInfo: '修改数据'
          }).then(() => {
            resolve(responseDataModel(true, { message: '修改数据成功' }));
          }).catch(err => {
            reject(err);
          });
        }).
        catch(err => {
          reject(responseDataModel(false, { err: err }, '修改数据失败'));
        });
      } else {
        resolve(res);
      }
    }).
    catch(err => {
      reject(err);
    });
  });
};

/**
 * ------- 删除数据 ---------
 * body: {
 *   id: <String> 数据库查询 _id
 * }
 */
const dataDelete = body => {
  return new Promise((resolve, reject) => {
    // 删除 api
    apiDataModel.updateOne(
      {_id: body.dataId},
      {$set: { 'delete': true }}
    ).
    then(() => {
      // 记录操作历史
      apiHistoryInsert({
        apiId: body.id,
        // updateBy: body.createBy,
        updateInfo: '删除数据'
      }).then(() => {
        resolve(responseDataModel(true, { message: '删除数据成功' }));
      }).catch(err => {
        reject(err);
      });
    }).
    catch(err => {
      reject(responseDataModel(false, { err: err }, '删除数据失败'));
    });
  });
};


module.exports.apiFindOne = apiFindOne;
module.exports.apiFind = apiFind;
module.exports.apiInsert = apiInsert;
module.exports.apiChange = apiChange;
module.exports.apiDelete = apiDelete;

module.exports.dataFindOne = dataFindOne;
module.exports.dataFind = dataFind;
module.exports.dataInsert = dataInsert;
module.exports.dataChange = dataChange;
module.exports.dataDelete = dataDelete;
