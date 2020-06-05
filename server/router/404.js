'use strict';

// 404 页面返回信息

module.exports = () => {
  return async (ctx, next) => {

    ctx.status = 404;

    switch (ctx.accepts('html', 'json')) {
      case 'html':
        ctx.type = 'html';
        ctx.body = '<h2>404 Page Not Found<h2>';
        break;
      case 'json':
        ctx.body = {
          message: '404 Page Not Found'
        };
        break;
      default:
        ctx.type = 'text';
        ctx.body = '404 Page Not Found';
    }

    await next();
  }
};
