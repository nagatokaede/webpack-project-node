'use static';

const fs = require('fs');
const path = require('path');
const jwt = require('./bin/jwt');

// Token 数据
const payload = {
  name: 'NagatoKaede',
  admin: true
};

// HS256 对称算法
// 密钥
const secret = 'hotcake';

// HR256 非对称算法
// 公钥
const publicKey = fs.readFileSync(path.normalize(__dirname + '/config/public.key'));

const tokenHS = jwt.tokenHS(payload, secret);
console.log(tokenHS);

const tokenRS = jwt.tokenRS(payload);
console.log(tokenRS);

jwt.verifyHS(tokenHS, secret).
then(res => {
  console.log(res);
}).
catch(err => {
  console.warn(err);
});

jwt.verifyRS(tokenRS, publicKey).
then(res => {
  console.log(res);
}).
catch(err => {
  console.warn(err);
});
