'use static';

const mongoose = require('mongoose');

require('../conn_mongo');

/*
 * ------- 留言表 ---------
 * createTime: <Date> 创建时间
 * name: <String> 姓名
 * sex: <Number> 性别 (0 女 1 男)
 * join: <Boolean> 是否参加
 * companion: <String> 期望同住人
 * familyName: <String> 家属姓名
 * familyID_NO: <String> 家属身份证号
 * children: [
 *    {
 *       name: <String> 姓名
 *       ID_NO: <String> 身份证号
 *    }
 * ] <Array> 子女
 * remark: <String> 备注
 * delete: <Boolean> 逻辑删除
 */

// 将 mongoose.Schema 赋值给一个变量来定义一个数据约束
const informationStatisticsSchema = mongoose.Schema({
  createTime: {
    type: Date,
    default: new Date()
  },
  name: String,
  sex: Number,
  join: {
    type: Boolean,
    default: true
  },
  companion: String,
  familyName: String,
  familyID_NO: String,
  children: Array,
  remark: String,
  delete: {
    type: Boolean,
    default: false
  },
});


/*
 * ------- 操作记录表 ---------
 * leaveMessageId: <_id> 留言表 _id
 * updateTime: <Date> 修改时间
 * updateBy: <string> 修改者
 * updateInfo: <string> 修改信息
 */

const informationStatisticsHistorySchema = mongoose.Schema({
  informationStatisticsId: String,
  updateTime: {
    type: Date,
    default: new Date()
  },
  updateBy: String,
  updateInfo: String
});

// mongoose.model(modeName, schema)
// model 就是数据库中的集合 collection
const informationStatisticsModel = mongoose.model('information_statistics', informationStatisticsSchema);
const informationStatisticsHistoryModel = mongoose.model('information_statistics_history', informationStatisticsHistorySchema);

module.exports.informationStatisticsModel = informationStatisticsModel;
module.exports.informationStatisticsHistoryModel = informationStatisticsHistoryModel;