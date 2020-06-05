'use static';

const fs = require('fs');

module.exports = {
  readFile(path) {
    return new Promise((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) {
          console.warn(err);
          reject(err);
        } else {
          // 返回值为 buffer 类型
          // 事先设置 options 中 encoding 编码，得到的数据类型会改变
          // 例如 utf-8 则 data 类型为 <string>
          resolve(data);
        }
      });
    });
  },
  
  readFileSync(path) {
    return fs.readFileSync(path);
  },
};