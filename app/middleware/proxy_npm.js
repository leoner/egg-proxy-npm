'use strict';

const path = require('path');
const fs = require('fs/promises');
const crypto = require('crypto');
const mime = require('mime-types');

async function loadFile(fileName) {
  const extName = path.extname(fileName);
  const stats = fs.stat(fileName);
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
  const { baseDir, cacheControl } = app.config.npmProxy;
  return async function proxyNpm(ctx, next) {
    // 检查请求的是否是 umi 的静态资源
    if (ctx.method !== 'HEAD' && ctx.method !== 'GET') return await next();

    let url = ctx.url;
    if (url.indexOf('/npm') === 0) {
      // 先取出头部的 npm
      url = url.replace(/^\/npm\//, '');
      // '@ant-design/pro-table@2.71.7/es/Table.js'; 分割出来包名和版本号 [ '@ant-design/pro-table@2.71.', '7', '/es/Table.js' ]
      // js 不支持逆序环视
      const parts = url.split(/(\d)(?=\/)/);
      // 剔除前面多余的2部分
      const packageName = `${parts[0]}${parts[1]}`;
      const [ name, version ] = packageName.split(/@(?=\d)/);
      // 1. 查找 node_modules 下的包
      const packageJsonPath = path.join(baseDir, name, 'package.json');
      try {
        const packageJson = JSON.parse(await fs.readFile(packageJsonPath, 'utf8'));
        if (packageJson.version !== version) {
          ctx.logger.warn(`[NpmProxy] dependency module ${packageName} version inconsistency, real version ${packageJson.version}`);
        }
        const file = await loadFile(path.join(baseDir, name, parts[2]));
        ctx.status = 200;
        ctx.set('content-type', file.type);
        ctx.set('content-length', file.length);
        ctx.set('cache-control', cacheControl);

        if (file.md5) {
          ctx.set('content-md5', file.md5);
          ctx.set('etag', file.md5);
        }

        ctx.body = file.buffer;
        return;

      } catch (e) {
        ctx.logger.error(`[NpmProxy] Not found dependency ${packageName} ${e.message}`);
      }
    }

    await next();
  };
};

