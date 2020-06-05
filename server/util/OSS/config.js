'use static';

const config = {
  AccessKeyId: '',
  AccessKeySecret: '',
  Region: '',
  RoleArn: '',
  Expiration: 60 * 60,
  SessionName: 'kaede',
  Policy: {
    "Statement": [
      {
        "Action": [
          "oss:*",
        ],
        "Effect": "Allow",
        "Resource": ["acs:oss:*:*:*"]
      }
    ],
    "Version": "1"
  }
};

module.exports = config;
