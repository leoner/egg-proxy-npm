'use strict';

const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');
const mime = require('mime-types');

async function loadFile(fileName) {
  const extName = path.extname(fileName);
  const stats = await fs.stat(fileName);
  const buffer = await fs.readFile(fileName);

  const obj = {};
  obj.buffer = buffer;
  obj.type = mime.lookup(extName) || 'application/octet-stream';
  obj.mtime = stats.mtime;
  obj.length = stats.size;
  obj.md5 = crypto.createHash('md5').update(buffer).digest('base64');
  return obj;
}

module.exports = (options, app) => {
  const { baseDir, cacheControl, disableNpm } = app.config.npmProxy;
  return async function proxyNpm(ctx, next) {
    if (disableNpm) {
      await next();
      return;
    }

    if (ctx.method !== 'HEAD' && ctx.method !== 'GET') {
      return;
    }

    let url = ctx.url;
    if (url.indexOf('/npm') === 0) {
      // 先去除头部的 npm
      url = url.replace(/^\/npm\//, '');
      // '@ant-design/pro-table@2.71.7/es/Table.js'; 分割出来包名和版本 [ '@ant-design/pro-table', '2.71.7', '/es/Table.js' ]
      const [ packageName, version, filePath ] = url.split(/@(\d[^\/]+)/);
      const packageJsonPath = path.join(baseDir, packageName, 'package.json');
      try {
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
        // 1. 检查版本
        if (packageJson.version !== version) {
          ctx.logger.warn(`[NpmProxy] dependency module ${packageName} version inconsistency, real version ${packageJson.version}`);
        }
        // 2. 获取文件
        const file = await loadFile(path.join(baseDir, packageName, filePath));
        ctx.status = 200;
        ctx.set('content-type', file.type);
        ctx.set('content-length', file.length);
        ctx.set('cache-control', cacheControl);
        ctx.set('content-md5', file.md5);
        ctx.set('etag', file.md5);

        if (ctx.method === 'HEAD') return;
        ctx.body = file.buffer;
        return;

      } catch (e) {
        ctx.logger.error(`[NpmProxy] Not found dependency ${packageName} ${e.message}`);
      }
    }

    await next();
  };
};

