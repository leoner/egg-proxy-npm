'use strict';

const path = require('path');

module.exports = () => {
  return async function proxy_umi_resources(ctx, next) {
    // 检查请求的是否是 umi 的静态资源
    const url = ctx.url;
    const { npmProxy, env, disableProxyInternal } = ctx.app.config || {};

    if (disableProxyInternal) {
      await next();
      return;
    }

    // 只有测试环境和开发环境才启用
    if (env !== 'unittest' && env !== 'dev' && env !== 'local') {
      await next();
      return;
    }

    const extName = path.extname(url);

    // console.info('====>', url);
    if (url.indexOf('/npm') === 0) {
      await next();
      return;
    }

    if (url === '/index.css') {
      await next();
      return;
    }

    if (/\.(?:js|css|map|jpg)$/.test(extName)) {
      // ctx.addHeader('Content-Type', mime.lookup(extName));
      // 读取静态文件目录
      return ctx.redirect(`http://127.0.0.1:${npmProxy.npmServerPort || 8000}${ctx.url}`);
    }
    await next();
  };
};
