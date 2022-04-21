# egg-proxy-npm

[![NPM version][npm-image]][npm-url]
[![build status][travis-image]][travis-url]
[![Test coverage][codecov-image]][codecov-url]
[![David deps][david-image]][david-url]
[![Known Vulnerabilities][snyk-image]][snyk-url]
[![npm download][download-image]][download-url]

[npm-image]: https://img.shields.io/npm/v/egg-proxy-npm.svg?style=flat-square
[npm-url]: https://npmjs.org/package/egg-proxy-npm
[travis-image]: https://img.shields.io/travis/eggjs/egg-proxy-npm.svg?style=flat-square
[travis-url]: https://travis-ci.org/eggjs/egg-proxy-npm
[codecov-image]: https://img.shields.io/codecov/c/github/eggjs/egg-proxy-npm.svg?style=flat-square
[codecov-url]: https://codecov.io/github/eggjs/egg-proxy-npm?branch=master
[david-image]: https://img.shields.io/david/eggjs/egg-proxy-npm.svg?style=flat-square
[david-url]: https://david-dm.org/eggjs/egg-proxy-npm
[snyk-image]: https://snyk.io/test/npm/egg-proxy-npm/badge.svg?style=flat-square
[snyk-url]: https://snyk.io/test/npm/egg-proxy-npm
[download-image]: https://img.shields.io/npm/dm/egg-proxy-npm.svg?style=flat-square
[download-url]: https://npmjs.org/package/egg-proxy-npm

<!--
Description here.
-->

## Install

```bash
$ npm i egg-proxy-npm --save
```

## Usage

```js
// {app_root}/config/plugin.js
exports.proxyNpm = {
  enable: true,
  package: 'egg-proxy-npm',
};
```

## Configuration

```js
// {app_root}/config/config.default.js
exports.proxyNpm = {
  baseDir: path.join(appInfo.baseDir, 'node_modules'), // 配置文件具体存放地址, 默认node_modules 目录
  cacheControl: `public, max-age=${6000 * 24 * 60 * 60 * 1000}`,
};
```

see [config/config.default.js](config/config.default.js) for more detail.

## Example

<!-- example here -->

## Questions & Suggestions

Please open an issue [here](https://github.com/leoner/egg-proxy-npm/issues).

## License

[MIT](LICENSE)
