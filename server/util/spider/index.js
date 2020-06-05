'use static';
const getHtml = require('./bin/spider');

getHtml('https://www.instagram.com/p/BvYbAbrBU8v/?utm_source=ig_share_sheet&igshid=betpf9thpwz5').
then(res => {
  console.info(res);
}).
catch(err => {
  console.warn(err);
});
