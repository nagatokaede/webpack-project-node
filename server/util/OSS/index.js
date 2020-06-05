'use static';

const fs = require('fs');
const path = require('path');

const local = path.normalize(__dirname + '/util');

const files = fs.readdirSync(local);

const OSS = {};
files.forEach(fileName => {
  const localFile = path.join(local, fileName);
  Object.entries(require(localFile)).forEach(([ key, val ]) => {
    if (typeof val === 'function') OSS[key] = val;
  });
});

module.exports = OSS;
