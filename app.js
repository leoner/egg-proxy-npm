'use strict';

module.exports = app => {
  // 插入到最前面
  app.coreLogger.error('============');
  app.config.coreMiddleware.unshift('proxyNpm');
};
