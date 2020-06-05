'use static';

const env = process.env;

const config = {
  NODE_ENV: env.NODE_ENV || 'development',
  PORT: env.PORT || '3000',
  MONGO_HOST: env.MONGO_HOST || 'localhost',
  MONGO_PORT: env.MONGO_PORT || '15498',
  MONGO_DB: env.MONGO_DB || 'webpack_project',

  AccessKeyId: '',
  AccessKeySecret: '',
  Region: 'oss-cn-hongkong',
  RoleArn: 'acs:ram::1048294054644179:role/nagato-ram',
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
