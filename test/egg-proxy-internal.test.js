'use strict';

const mm = require('egg-mock');

describe.skip('test/egg-proxy-internal.test.js', () => {
  let app;
  before(() => {
    mm.env('unittest');
    app = mm.app({
      baseDir: 'apps/egg-proxy-npm-internal',
    });
    return app.ready();
  });

  after(() => app.close());
  afterEach(mm.restore);

  it('should GET /umi.js', async () => {
    const response = await app.httpRequest()
      .get('/umi.js')
      .expect('Content-Type', 'application/javascript')
      .expect(200);
  });
});
