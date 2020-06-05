'use static';

const crypto = require('crypto');

const { userModel, userHistoryModel } = require('../modules/user');

// 加密
const hash = data => {
  return crypto.createHmac('sha256', 'hotcake').update(data).digest('hex');
};

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
 *   userId: <_id> 用户 _id
 *   updateBy: <string> 修改者
 *   updateInfo: <string> 修改信息
 * }
 */
const userHistoryInsert = body => {
  return new Promise((resolve, reject) => {
    const createUserHistory = new userHistoryModel(body);
    createUserHistory.save(err => { // 保存数据
      if (err) {
        reject(responseDataModel(false, { err: err }, '操作记录失败'));
      } else {
        resolve(responseDataModel(true, { data: createUserHistory}));
      }
    });
  });
};

/**
 * -------- 查询用户 ----------
 * body: {
 *   userName: <String> 用户名
 * }
 */
const userFindOne = body => {
  return new Promise((resolve, reject) => {
    userModel.findOne(body).
    then(docs => {
      console.log(docs);
      let status = 0;
      if (!docs) {
        status = 1;
        docs = '用户名不存在！';
      } else if (docs.delete) {
        status = 2;
        docs = '用户已注销！';
      }
      if (status) {
        resolve(responseDataModel(false, { status: status }, docs));
      } else {
        resolve(responseDataModel(true, docs));
      }
    }).
    catch(err => {
      console.warn(err);
      reject(responseDataModel(false, { err: err }, '用户查询失败'));
    });
  });
};


/**
 * -------- 用户登陆 ----------
 * body {
 *   userName: <String> 用户名
 *   password: <String> 密码
 * }
 */
const userLogin = body => {
  return new Promise((resolve, reject) => {
    userModel.findOne({
      userName: body.userName,
    }).
    select({
      userName: 1,
      password: 1,
      nickName: 1,
      delete: 1,
    }).
    then(docs => {
      let status = 0;
      if (!docs) {
        status = 1;
        docs = '用户名不存在！';
      } else if (docs.delete) {
        status = 2;
        docs = '用户已注销！';
      } else if (docs.password !==  hash(body.password)) {
        status = 3;
        docs = '密码错误！';
      }
      if (status) {
        resolve(responseDataModel(false, { status: status }, docs));
      } else {
        resolve(responseDataModel(true, { data: docs }));
      }
    }).
    catch(err => {
      reject(responseDataModel(false, { err: err }, '用户查询失败'));
    });
  });
};


/**
 * ------- 插入用户 ---------
 * body {
 *   userName: <String> 用户名
 *   password: <String> 密码
 *   nickName: <string> 昵称
 * }
 */
const userInsert = body => {
  return new Promise((resolve, reject) => {
    // 查找用户
    userFindOne({ userName: body.userName }).
    then(res => {
      if (res.data.status === 1) {
        // 创建用户数据
        const createUser = new userModel({
          userName: body.userName,
          password: hash(body.password),
          nickName: body.nickName
        });
        // 保存数据
        createUser.save(err => {
          if (err) {
            reject(responseDataModel(false, { err: err }, '新增用户失败'));
          } else {
            // 记录操作历史
            userHistoryInsert({
              userId: createUser._id,
              updateBy: createUser.userName,
              updateInfo: '新增用户'
            }).then(() => {
              resolve(responseDataModel(true, { message: '新增用户成功' }));
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
 * ------- 修改用户密码 ---------
 * body {
 *   userName: <String> 用户名
 *   password: <String> 密码
 *   newPassword: <String> 新密码
 *   nickName: <string> 昵称
 * }
 */
const userChangePassword = body => {
  return new Promise((resolve, reject) => {
    // 查找用户
    userFindOne(body).
    then(res => {
      if (res.status === 0) {
        userModel.updateOne(
          {_id: res.data._id},
          {$set: { 'password': hash(body.newPassword) }}
        ).
        then(() => {
          // 记录操作历史
          userHistoryInsert({
            userId: res.data._id,
            updateBy: res.data.userName,
            updateInfo: '修改密码'
          }).then(() => {
            resolve(responseDataModel(true, { message: '修改密码成功' }));
          }).catch(err => {
            reject(err);
          });
        }).
        catch(err => {
          reject(responseDataModel(false, { err: err }, '修改密码失败'));
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
 * ------- 删除用户 ---------
 * body: {
 *   id: <String> 数据库查询 _id
 *   updateBy: <String> 修改者
 * }
 */
const userDelete = body => {
  return new Promise((resolve, reject) => {
    // 删除用户
    userModel.updateOne(
      {_id: body.id},
      {$set: { 'delete': true }}
    ).
    then(() => {
      // 记录操作历史
      userHistoryInsert({
        userId: body.id,
        updateBy: body.createBy,
        updateInfo: '删除用户'
      }).then(() => {
        resolve(responseDataModel(true, { message: '删除用户成功' }));
      }).catch(err => {
        reject(err);
      });
    }).
    catch(err => {
      reject(responseDataModel(false, { err: err }, '删除用户失败'));
    });
  });
};

module.exports.userFindOne = userFindOne;
module.exports.userLogin = userLogin;
module.exports.userInsert = userInsert;
module.exports.userChangePassword = userChangePassword;
module.exports.userDelete = userDelete;
