'use static';

const { stsClient } = require('../identification.js');

/**
 * 列举指定存储空间下的文件 通过list接口列举当前 Bucket 下的所有文件。
 * @param {String} bucketName - Bucket
 * @param {Object} params - {
 * prefix: 只列出符合特定前缀的文件。,
 * marker: 只列出文件名大于 marker 之后的文件。,
 * delimiter: 用于获取文件的公共前缀。,
 * max-keys: 用于指定最多返回的文件个数。
 * }
 * @return {Promise<void>}
 */
async function getDirList (bucketName, params) {
  try {
    // 获取 oss 权限
    const client = await stsClient(bucketName);
    // 通过list接口列举当前 Bucket 下的所有文件。
    let result = await client.list(params);
    console.log(result.objects || result.prefixes);
    return result.objects || result.prefixes;
  } catch (err) {
    console.warn(err);
  }
}

/**
 * 删除单个文件
 * @param {String} bucketName - Bucket
 * @param {String} objName - object-name
 * @return {Promise<void>}
 */
async function deleteDir (bucketName, objName) {
  try {
    // 获取 oss 权限
    const client = await stsClient(bucketName);
    // 删除单个文件
    let result = await client.delete(objName);
    console.log(result);
  } catch (err) {
    console.warn(err);
  }
}

/**
 * 删除多个文件
 * @param {String} bucketName - Bucket
 * @param {Array} objList - ['obj-1', 'obj-2', 'obj-3']
 * @param {Object} options - { quiet: true } 通过quiet参数来指定是否返回删除的结果
 * @return {Promise<void>}
 */
async function deleteMulti (bucketName, objList, options) {
  try {
    // 获取 oss 权限
    const client = await stsClient(bucketName);
    // 删除多个文件
    let result = await client.deleteMulti(objList, options);
    console.log(result);
  } catch (err) {
    console.warn(err);
  }
}

// getDirList('nagato-oss', { "max-keys": 50, delimiter: '/' });
// deleteDir('nagato-oss', 'Video/TheBoysS01E08.HD1080P.mp4');
module.exports.getDirList = getDirList;
module.exports.deleteDir = deleteDir;
module.exports.deleteMulti = deleteMulti;
