'use static';

const mongoose = require('mongoose');

require('../conn_mongo');

/*
 * ------- 留言表 ---------
 * createTime: <Date> 创建时间
 * userName: <string> 用户名
 * password: <string> 密码
 * nickName: <string> 昵称
 * delete: <Boolean> 逻辑删除
 */

// 将 mongoose.Schema 赋值给一个变量来定义一个数据约束
const userSchema = mongoose.Schema({
  createTime: {
    type: Date,
    default: new Date()
  },
  userName: String,
  password: String,
  nickName: String,
  bucketName: {
    type: String,
    default: 'nagato-oss',
  },
  delete: {
    type: Boolean,
    default: false
  },
});

/*
 * ------- 留言操作记录表 ---------
 * userId: <_id> 留言表 _id
 * updateTime: <Date> 修改时间
 * updateBy: <string> 修改者
 * updateInfo: <string> 修改信息
 */

const userHistorySchema = mongoose.Schema({
  userId: String,
  updateTime: {
    type: Date,
    default: new Date()
  },
  updateBy: String,
  updateInfo: String
});

// mongoose.model(modeName, schema)
// model 就是数据库中的集合 collection
const userModel = mongoose.model('user', userSchema);
const userHistoryModel = mongoose.model('user_history', userHistorySchema);

module.exports.userModel = userModel;
module.exports.userHistoryModel = userHistoryModel;
