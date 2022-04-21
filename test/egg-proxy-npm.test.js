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
  });

  // 错误的
  it('should GET /npm/antd/2.71.7/es/Table.js', async () => {
    await app.httpRequest()
      .get('/npm/antd/2.71.7/es/Table.js')
      .expect(404);
  });
});
