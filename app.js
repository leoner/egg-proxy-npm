'use strict';

module.exports = app => {
  // 插入到最前面
  // 代理 umi 静态资源，内部直接重定向到 8000 端口
  app.config.coreMiddleware.unshift('proxyInternal');
  app.config.coreMiddleware.unshift('proxyNpm');
};
