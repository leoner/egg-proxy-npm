'use strict';

const mm = require('egg-mock');
const assert = require('assert');

describe('test/egg-proxy-npm.test.js', () => {
  let app;
  before(() => {
    app = mm.app({
      baseDir: 'apps/egg-proxy-npm-test',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mm.restore);

  //npm/antd-protable-component@0.1.3/
  it('should GET /npm/antd@4.19.5/es/button/button.js', async () => {
    const response = await app.httpRequest()
      .get('/npm/antd@4.19.5/es/button/button.js')
      .expect(/^import/)
      .expect('Content-Type', 'application/javascript')
      .expect('cache-control', 'public, max-age=518400000000')
      .expect(200);
    assert(response.header.etag);
  });

  it('should GET /npm/@ant-design/pro-table@2.71.7/es/Table.js', async () => {
    const response = await app.httpRequest()
      .get('/npm/@ant-design/pro-table@2.71.7/es/Table.js')
      .expect(/^import/)
      .expect('Content-Type', 'application/javascript')
      .expect('cache-control', 'public, max-age=518400000000')
      .expect(200);
    assert(response.header.etag);

    await app.httpRequest()
      .get('/npm/@ant-design/pro-table@2.11.11/es/Table.js')
      .expect(/^import/)
      .expect('Content-Type', 'application/javascript')
      .expect('cache-control', 'public, max-age=518400000000')
      .expect(200);

    // 如果版本错误
    app.expectLog('[NpmProxy] dependency module @ant-design/pro-table version inconsistency', 'logger');
  });

  it('HEAD /npm/antd@4.19.5/es/button/button.js', async () => {
    await app.httpRequest()
      .head('/npm/antd@4.19.5/es/button/button.js')
      .expect('Content-length', '9734')
      .expect(undefined) // head 返回的是空
      .expect(200);
  });

  it('POST /npm/antd@4.19.5/es/button/button.js', async () => {
    await app.httpRequest()
      .post('/npm/antd@4.19.5/es/button/button.js')
      .expect('Content-length', '9')
      .expect('Not Found') // head 返回的是空
      .expect(404);
  });

  // 错误场景
  it('GET /npm/antd/2.71.7/es/Table.js error', async () => {
    await app.httpRequest()
      .get('/npm/antd/2.71.7/es/Table.js')
      .expect(404);
  });

  // 非 npm 资源直接重定向内部资源
  it('GET /antd/2.71.7/es/Table.js error', async () => {
    await app.httpRequest()
      .get('/antd/2.71.7/es/Table.js')
      .expect(302);
  });

  // 非前端资源文件
  it('GET /npm/antd@4.19.5/es/button/button.bb content-type is stream', async () => {
    await app.httpRequest()
      .get('/npm/antd@4.19.5/es/button/button.bb')
      .expect('Content-Type', 'application/octet-stream')
      .expect(200);
  });

  it('GET / 首页', async () => {
    await app.httpRequest()
      .get('/')
      .expect(200);
  });
});
