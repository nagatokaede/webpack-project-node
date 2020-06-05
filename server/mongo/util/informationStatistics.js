'use static';

const { informationStatisticsModel, informationStatisticsHistoryModel } = require('../modules/informationStatistics');


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


/*
 * ------- 留言操作记录表 ---------
 * body {
 *   leaveMessageId: <_id> 留言表 _id
 *   updateBy: <string> 修改者
 *   updateInfo: <string> 修改信息
 * }
 */
const informationStatisticsHistoryInsert = body => {
  return new Promise((resolve, reject) => {
    const createLeaveMessageHistory = new informationStatisticsHistoryModel(body);
    createLeaveMessageHistory.save(err => { // 保存数据
      if (err) {
        reject(responseDataModel(false, { err: err }, '操作记录失败'));
      } else {
        resolve(responseDataModel(true, { data: createLeaveMessageHistory }));
      }
    });
  });
};

// 分页查询留言表
/*
 * query {
 *   pageIndex: <Number> 页码
 *   pageSize: <Number> 每页显示条数
 * }
 */
const informationStatisticsFindByPage = query => {
  return new Promise((resolve, reject) => {
    informationStatisticsModel.find({
      delete: { $ne: true }
    }).
    skip(((query.pageIndex || 1) - 1) * (query.pageSize || 10)).
    limit(query.pageSize || 10).
    select({
      name: 1,
      sex: 1,
      join: 1,
      companion: 1,
      familyName: 1,
      familyID_NO: 1,
      children: 1,
      remark: 1,
    }).
    then(docs => {
      resolve(responseDataModel(true, {
        pageData: docs,
        totalCount: docs.length,
      }));
    }).
    catch(err => {
      reject(responseDataModel(false, { err: err }, '分页查询留言表失败'));
    });
  });
};

// 插入留言
/*
 * ------- 留言表 ---------
 * body {
 *   createBy: <string> 创建人
 *   message: <string> 留言
 * }
 */

const informationStatisticsInsert = body => {
  return new Promise((resolve, reject) => {
    const createLeaveMessage = new informationStatisticsModel({
      name: body.name,
      sex: body.sex,
      join: body['join'],
      companion: body.companion,
      familyName: body.familyName,
      familyID_NO: body.familyID_NO,
      children: body.children,
      remark: body.remark,
    });
    createLeaveMessage.save(err => { // 保存数据
      if (err) {
        reject(responseDataModel(false, { err: err }, '新增留言失败'));
      } else {
        // 记录操作历史
        informationStatisticsHistoryInsert({
          leaveMessageId: createLeaveMessage._id,
          updateBy: createLeaveMessage.createBy,
          updateInfo: '新增留言'
        }).then(() => {
          resolve(responseDataModel(true, { message: '新增留言成功！' }));
        }).catch(err => {
          reject(err);
        });
      }
    });
  });
};

// 删除留言
/*
 * body: {
 *   id: <String> 数据库查询 _id
 *   updateBy: <String> 修改者
 * }
 */
const informationStatisticsDelete = body => {
  return new Promise((resolve, reject) => {
    // 删除留言
    informationStatisticsModel.updateOne(
      {_id: body.id},
      {$set: { 'delete': true }}
    ).
    then(() => {
      // 记录操作历史
      informationStatisticsHistoryInsert({
        leaveMessageId: body.id,
        updateBy: body.createBy,
        updateInfo: '删除留言'
      }).then(() => {
        resolve(responseDataModel(true, { message: '删除留言成功！' }));
      }).catch(err => {
        reject(err);
      });
    }).
    catch(err => {
      reject(responseDataModel(false, { err: err }, '删除留言失败'));
    });
  });
};


module.exports.informationStatisticsFindByPage = informationStatisticsFindByPage;
module.exports.informationStatisticsInsert = informationStatisticsInsert;
module.exports.informationStatisticsDelete = informationStatisticsDelete;
