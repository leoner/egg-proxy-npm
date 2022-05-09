'use strict';

const path = require('path');

module.exports = appInfo => {
  const exports = {};
  /**
   *  npm 资源代理
   *
   * @member Config#npmProxy
   * @property {String} baseDir - npm resources default store dir.
   * @property {Number} maxAge - cache max age, default is 1天
   * @see https://github.com/leoner/egg-npm-proxy
   */
  exports.npmProxy = {
    baseDir: path.join(appInfo.baseDir, 'node_modules'),
    cacheControl: `public, max-age=${6000 * 24 * 60 * 60 * 1000}`,
    npmServerPort: 8000,
    disableProxyInternal: false,
    disableNpm: false,
  };

  return exports;
};
