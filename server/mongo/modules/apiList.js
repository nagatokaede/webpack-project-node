'use static';

const mongoose = require('mongoose');

require('../conn_mongo');

/*
 * ------- api list ---------
 * createTime: <Date> 创建时间
 * type: <string> 请求类型 GET POST PUT DELETE
 * uri: <string> 请求路径
 * isList: <Boolean> 是否为列表类型数据
 * query: <Array> query 参数
 * body: <Array> body 参数
 * remark: <string> 备注
 */

// 将 mongoose.Schema 赋值给一个变量来定义一个数据约束
const apiSchema = mongoose.Schema({
  createTime: {
    type: Date,
    default: new Date()
  },
  type: String,
  uri: String,
  isList: Boolean,
  query: Array,
  body: Array,
  remark: String,
  delete: {
    type: Boolean,
    default: false
  },
});

/*
 * ------- 操作记录表 ---------
 * apiId: <_id> 留言表 _id
 * updateTime: <Date> 修改时间
 * updateBy: <string> 修改者
 * updateInfo: <string> 修改信息
 */

const apiHistorySchema = mongoose.Schema({
  apiId: String,
  updateTime: {
    type: Date,
    default: new Date()
  },
  // updateBy: String,
  updateInfo: String
});

/*
 * ------- 接口绑定数据表 ---------
 * apiId: <_id> 留言表 _id
 * updateTime: <Date> 修改时间
 * data: <Array> 数据
 */

const apiDataSchema = mongoose.Schema({
  apiId: String,
  updateTime: {
    type: Date,
    default: new Date()
  },
  data: Object,
  delete: {
    type: Boolean,
    default: false
  },
});

// mongoose.model(modeName, schema)
// model 就是数据库中的集合 collection
const apiModel = mongoose.model('api', apiSchema);
const apiHistoryModel = mongoose.model('api_history', apiHistorySchema);
const apiDataModel = mongoose.model('api_data', apiDataSchema);

module.exports.apiModel = apiModel;
module.exports.apiHistoryModel = apiHistoryModel;
module.exports.apiDataModel = apiDataModel;
