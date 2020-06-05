'use static';
const request = require('request');

const getHtml = url => {
  return new Promise((resolve, reject) => {
    console.log('--- 开始爬取资源 ---');
    request(url, (err, res, body) => {
      if (!err && res.statusCode === 200) {
        const reg = /(display_url":")[a-zA-z]+:\/\/[^"]*/ig;
        const content = body.match(reg);
        const urlList = [];
        if (content[0] !== content[1]) {
          urlList.push(content[0].split('display_url":"')[1].replace(/\\u0026/g, '&'));
        }
        for (let i = 1; i < content.length; i++) {
          urlList.push(content[i].split('display_url":"')[1].replace(/\\u0026/g, '&'));
        }
        resolve({
          data: {
            data: urlList,
          },
          description: 'SUCCESS',
        });
      }
      if (err) {
        reject({
          data: {
            message: '爬取失败',
            err: err,
          },
          description: 'DEFEAT',
        });
      }
      console.log('--- 爬取资源结束 ---');
    });
  });
};

module.exports = getHtml;
