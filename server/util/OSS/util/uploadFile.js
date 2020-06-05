'use static';

const fs = require('fs');
const { stsClient } = require('../identification');

function test1 () {
  fs.readFile('./stsToken.js', (err, data) => {
    if (err) {
      console.warn(err);
    } else {
      // 返回值为 buffer 类型
      // 事先设置 options 中 encoding 编码，得到的数据类型会改变
      // 例如 utf-8 则 data 类型为 <string>
      console.log(data);
      putBuffer('nagato-oss', 'Other/test1.js', data);
    }
  });
}

function test2 () {
  let stream = fs.createReadStream('./uploadFile.js');
  let size = fs.statSync('./uploadFile.js').size;
  putStream('nagato-oss', 'Other/test2.js', stream, size);
}

/**
 * 通过put接口将本地文件上传到 OSS
 * @param {String} bucketName - Bucket
 * @param {String} objectName - 可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
 * @param {String} localFile - 本地文件地址
 * @return {Promise<void>}
 */
async function putFile (bucketName, objectName, localFile) {
  try {
    // 获取 oss 权限
    const client = await stsClient(bucketName);
    // 本地文件地址上传
    let result = await client.put(objectName, localFile);
    console.log(result);
  } catch (err) {
    console.warn(err);
  }
}

/**
 * 通过put接口简单地将本地内存中的内容上传到 OSS
 * @param {String} bucketName - Bucket
 * @param {String} objectName - 可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
 * @param {Buffer} buffer - 上传 buffer 文件
 * @return {Promise<void>}
 */
async function putBuffer (bucketName, objectName, buffer) {
  try {
    // 获取 oss 权限
    const client = await stsClient(bucketName);
    // buffer上传
    let result = await client.put(objectName, buffer);
    console.log(result);
  } catch (err) {
    console.warn(err);
  }
}

/**
 * 通过putStream接口来上传一个Stream中的内容，流式上传
 * @param {String} bucketName - Bucket
 * @param {String} objectName - 可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
 * @param {Stream} stream - 任何实现了Readable Stream的对象，包含文件流，网络流等
 * @param {Number} size - 文件大小；默认会发起一个chunked encoding的 HTTP PUT 请求。如果在options指定了contentLength参数，则不会使用chunked encoding。
 * @return {Promise<void>}
 */
async function putStream (bucketName, objectName, stream, size) {
  try {
    // 获取 oss 权限
    const client = await stsClient(bucketName);
    // use 'chunked encoding'
    const options = {};
    // size 存在则不使用 'chunked encoding'
    if (size) options.contentLength = size;
    // 流式上传
    let result = await client.putStream(objectName, stream, options);
    console.log(result);
  } catch (err) {
    console.warn(err)
  }
}

/**
 * 通过multipartUpload接口进行分片上传
 * @param {String} bucketName - Bucket
 * @param {String} objectName - 可以自定义为文件名（例如file.txt）或目录（例如abc/test/file.txt）的形式，实现将文件上传至当前Bucket或Bucket下的指定目录。
 * @param {String|File} file - 文件路径或者 HTML5 文件
 * @param {Object} options - {
 * {Object} checkpoint - 断点记录点。如果设置这个参数，上传会从断点开始，如果没有设置这个参数，则会重新上传
 * {Number} parallel - 并发上传的分片个数
 * {Number} partSize - 分片大小
 * {Function} progress - async 函数形式。回调函数包含三个参数：{
 *   {Number} percentage - 进度百分比（0-1之间小数）
 *   {Object} checkpoint - 断点记录点
 *   {Object} res - 单个分片成功返回的 response
 *   }
 * {Object} meta - 用户自定义 header meta 信息。header 前缀x-oss-meta-
 * {String} mime - 设置 Content-Type 请求头
 * {Object} headers - 其他 headers
 * }
 * @return {Promise<void>}
 */
async function multipartUpload (bucketName, objectName, file, options) {
  try {
    // 获取 oss 权限
    const client = await stsClient(bucketName);
    // 分片上传
    let result = await client.multipartUpload(objectName, file, options);
    console.log(result);
    let head = await client.head(objectName);
    console.log(head);
  } catch (err) {
    // 捕获超时异常
    if (err.code === 'ConnectionTimeoutError') {
      console.log("Woops,超时啦!");
      // do ConnectionTimeoutError operation
    }
    console.log(err)
  }
}

// putFile('nagato-oss', 'Other/uploadFile.js', './uploadFile.js');
// test1();
// test2();

module.exports.putFile = putFile;
module.exports.putBuffer = putBuffer;
module.exports.putStream = putStream;
module.exports.multipartUpload = multipartUpload;
