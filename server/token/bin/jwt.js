'use static';

const fs = require('fs');
const path = require('path');
const jwt = require('jsonwebtoken');

// 签发 Token
const tokenHS = (payload, secret) => {
  return jwt.sign(payload, secret, { expiresIn: '1day' });
};

// 输出签发的 Token
// console.log(tokenHS);


// 验证
const verifyHS = (tokenHS, secret) => {
  return new Promise((resolve, reject) => {
    jwt.verify(tokenHS, secret, (err, decoded) => {
      if (err) reject(err.message);
      resolve(decoded);
    });
  });
};

// RS256 非对称算法
// 读取 公私钥
const privateKey = fs.readFileSync(path.normalize(__dirname + '/../config/private.key'));

// 输出签发 Token
const tokenRS = payload => {
  return jwt.sign(payload, privateKey, {algorithm: 'RS256'});
};

// 验证
const verifyRS = (tokenRS, publicKey) => {
  return new Promise((resolve, reject) => {
    jwt.verify(tokenRS, publicKey, (err, decoded) => {
      if (err) reject(err.message);
      resolve(decoded);
    });
  });
};

module.exports.tokenHS = tokenHS;
module.exports.tokenRS = tokenRS;
module.exports.verifyHS = verifyHS;
module.exports.verifyRS = verifyRS;
