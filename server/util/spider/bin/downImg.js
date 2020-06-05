'use static';

const fs = require('fs');
const request = require('request');


const imgList = [
  'https://scontent-hkg3-1.cdninstagram.com/vp/edfee20d0c7f69d9f207dd328b22c33e/5D3200DE/t51.2885-15/e35/51292061_313307799377590_859206256567967607_n.jpg?_nc_ht=scontent-hkg3-1.cdninstagram.com',
  'https://scontent-hkg3-1.cdninstagram.com/vp/a72d706bb6b9dd4f73dd806d48ec4b91/5D418068/t51.2885-15/e35/53117275_404251990341445_8862361532893226129_n.jpg?_nc_ht=scontent-hkg3-1.cdninstagram.com',
  'https://scontent-hkg3-1.cdninstagram.com/vp/74ecd5209aea36081b81625f0d15f6c2/5D2A8CA1/t51.2885-15/e35/51003696_1519284541537361_6084853988263953575_n.jpg?_nc_ht=scontent-hkg3-1.cdninstagram.com',
  'https://scontent-hkg3-1.cdninstagram.com/vp/ba7c4d391292122732dac1d99fd0a326/5D495F5D/t51.2885-15/e35/50052848_533664920450994_8214500715203486122_n.jpg?_nc_ht=scontent-hkg3-1.cdninstagram.com',
  'https://scontent-hkg3-1.cdninstagram.com/vp/9972e28a8319dc073e2ce5fc4110b7e6/5D2F8F4C/t51.2885-15/e35/50138735_586240011847745_6018361582782467540_n.jpg?_nc_ht=scontent-hkg3-1.cdninstagram.com',
  'https://scontent-hkg3-1.cdninstagram.com/vp/2ac50ab0c511341f6a0cdcb3e98723a5/5D13FE31/t51.2885-15/e35/47586307_379890322763885_5846261261247506242_n.jpg?_nc_ht=scontent-hkg3-1.cdninstagram.com',
  'https://scontent-hkg3-1.cdninstagram.com/vp/957d69999b105d11df1d17339dcd0bbb/5D313A2D/t51.2885-15/e35/47694366_640135903071711_2525820795158636280_n.jpg?_nc_ht=scontent-hkg3-1.cdninstagram.com',
  'https://scontent-hkg3-1.cdninstagram.com/vp/b9e14b116772aec930b5175dba3eb34f/5D2B68F2/t51.2885-15/e35/47581852_165293161116087_6782640697668543849_n.jpg?_nc_ht=scontent-hkg3-1.cdninstagram.com',
  'https://scontent-hkg3-1.cdninstagram.com/vp/0c17b391403917635024c9d5f06acd42/5D4F8B12/t51.2885-15/e35/47317500_2095702924074983_1590763760601826977_n.jpg?_nc_ht=scontent-hkg3-1.cdninstagram.com',
  'https://scontent-hkg3-1.cdninstagram.com/vp/43bddaa8a6931d5dcac66bfb5b4bbbc5/5D42BF48/t51.2885-15/e35/47029210_347767179106126_7197737235669279671_n.jpg?_nc_ht=scontent-hkg3-1.cdninstagram.com',
  'https://scontent-hkg3-1.cdninstagram.com/vp/f2a410be2aa91fe2d0276fdfb2a75879/5D30D896/t51.2885-15/e35/44348169_389376314935953_306534959929335250_n.jpg?_nc_ht=scontent-hkg3-1.cdninstagram.com',
  'https://scontent-hkg3-1.cdninstagram.com/vp/80c2ea87aec4b6233c0649a4e0422a3e/5D4F3F0B/t51.2885-15/e35/43915083_254755341856293_8057487291940857181_n.jpg?_nc_ht=scontent-hkg3-1.cdninstagram.com'
];

const tool = (url, path) => {
  return new Promise((resolve, reject) => {
    const writeStream = fs.createWriteStream(path);

    const readStream = request(url);

    readStream.pipe(writeStream);
    readStream.on('end', () => {
      console.log('文件下载成功');
    });

    readStream.on('error', err => {
      console.warn('错误信息:' + err);
      reject({
        status: 'DEFEAT',
        err: err,
        url: url,
        name: path
      });
    });

    writeStream.on('finish', () => {
      console.log('文件写入成功');
      writeStream.end();
      resolve(path);
    });
  });
};

const downImg = imgList => {
  return new Promise((resolve, reject) => {
    const date = (new Date()).getTime();
    for (let i = 0; i < imgList.length; i++) {
      const name = date + '_' + i + '.jpg';

    }
  });
};

module.exports = downImg;
