'use static';

const { leaveMessageModel, leaveMessageHistoryModel } = require('../modules/leaveMessage');


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
const leaveMessageHistoryInsert = body => {
  return new Promise((resolve, reject) => {
    const createLeaveMessageHistory = new leaveMessageHistoryModel(body);
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
const leaveMessageFindByPage = query => {
  return new Promise((resolve, reject) => {
    leaveMessageModel.find({
      delete: { $ne: true }
    }).
    skip(((query.pageIndex || 1) - 1) * (query.pageSize || 10)).
    limit(query.pageSize || 10).
    select({
      createBy: 1,
      message: 1,
      createTime: 1,
      style: 1,
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

const leaveMessageInsert = body => {
  return new Promise((resolve, reject) => {
    const createLeaveMessage = new leaveMessageModel({
      createBy: body.createBy,
      message: body.message,
      style: body.style
    });
    createLeaveMessage.save(err => { // 保存数据
      if (err) {
        reject(responseDataModel(false, { err: err }, '新增留言失败'));
      } else {
        // 记录操作历史
        leaveMessageHistoryInsert({
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
const leaveMessageDelete = body => {
  return new Promise((resolve, reject) => {
    // 删除留言
    leaveMessageModel.updateOne(
      {_id: body.id},
      {$set: { 'delete': true }}
    ).
    then(() => {
      // 记录操作历史
      leaveMessageHistoryInsert({
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


module.exports.leaveMessageFindByPage = leaveMessageFindByPage;
module.exports.leaveMessageInsert = leaveMessageInsert;
module.exports.leaveMessageDelete = leaveMessageDelete;
