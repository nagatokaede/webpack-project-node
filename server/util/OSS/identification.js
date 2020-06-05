'use static';

const OSS = require('ali-oss');
const config = require('./config.js');
const { assumeRole } = require('./util/stsToken.js');

// 高级权限
const client = new OSS({
  accessKeyId: config.AccessKeyId,
  accessKeySecret: config.AccessKeySecret,
  region: config.Region,
  secure: true,
});

/**
 * sts 获取 oss 权限
 * @param {String} bucketName - Bucket
 * @return {Promise<Client>}
 * @constructor
 */
async function stsClient (bucketName) {
  try {
    // 获取 token
    const token = await assumeRole(config.RoleArn, config.Policy, config.Expiration, config.SessionName);
    // 使用 STS new OSS
    return new OSS({
      region: config.Region,
      accessKeyId: token.AccessKeyId,
      accessKeySecret: token.AccessKeySecret,
      stsToken: token.SecurityToken,
      bucket: bucketName
    });
  } catch (err) {
    console.warn(err);
  }
}

module.exports.client = client;
module.exports.stsClient = stsClient;
