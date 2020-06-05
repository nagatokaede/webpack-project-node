'use static';

const OSS = require('ali-oss');
const STS = OSS.STS;
const config = require('../config.js');

const sts = new STS({
  accessKeyId: config.AccessKeyId,
  accessKeySecret: config.AccessKeySecret,
});

/**
 * STS 签名
 * @param {String} roleArn - 表示自定义的权限策略名称
 * @param {Object} policy - 在扮演角色的时候额外添加的权限限制
 * @param {Number} expiration - 设置临时访问凭证的有效期，单位是s，最小为900，最大为3600
 * @param {String} sessionName - 用户自定义参数。
 * @returns {Promise<void>}
 */
async function assumeRole(roleArn, policy, expiration, sessionName) {
  try {
    const token = await sts.assumeRole(roleArn, policy, expiration, sessionName);
    console.log(token.credentials);
    return token.credentials;
  } catch (err) {
    console.log(err);
  }
}

// assumeRole(config.RoleArn, config.Policy, 60 * 60, 'kaede');

module.exports.assumeRole = assumeRole;
