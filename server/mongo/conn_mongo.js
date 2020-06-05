'use static';

const mongoose = require('mongoose');
const config = require('../config.js');

// 连接数据库
mongoose.connect(`mongodb://${config.MONGO_HOST}:${config.MONGO_PORT}/${config.MONGO_DB}`, { useNewUrlParser: true });

// 监听 MongoDB 连接状态
// 连接
mongoose.connection.once('open', (err) => {
  if (!err) {
    console.log(`数据库已连接！！`);
  }
});

// 断开
mongoose.connection.once('close', (err) => {
  if (!err) {
    console.log(`数据库已断开！！`);
  }
});
