'use static';

const { client } = require('../identification.js');

// put bucket
async function putBucket(bucketName) {
  try {
    const result = await client.putBucket(bucketName);
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

// get buckets list
async function listBuckets(options) {
  try {
    const result = await client.listBuckets(options);
    console.log(result);
    // const result2 = await client.listBuckets({
    //   prefix: 'nagato',
    // });
    // console.log(result2);
  } catch (err) {
    console.log(err);
  }
}

// put bucket acl 设置 bucket 访问权限
async function putBucketACL(bucketName, ACL) {
  try {
    const result = await client.putBucketACL(bucketName, ACL);
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

// get bucket ACL 查看 bucket 的访问权限
async function getBucketACL(bucketName) {
  try {
    const result = await client.getBucketACL(bucketName);
    console.log(result);
  } catch (err) {
    console.log(err);
  }
}

// putBucket('test-bucket');
// listBuckets();
// getBucketACL('nagato-oss');

module.exports.putBucket = putBucket;
module.exports.listBuckets = listBuckets;
module.exports.putBucketACL = putBucketACL;
module.exports.getBucketACL = getBucketACL;
