'use strict';

const path = require('path');
exports.keys = '123456';

exports.npmProxy = {
};

exports.security = {
  csrf: {
    enabled: false,
    supportedRequests: [        // supported URL path and method, the package will match URL path regex patterns one by one until path matched. We recommend you set {path: /^\//, methods:['POST','PATCH','DELETE','PUT','CONNECT']} as the last rule in the list, which is also the default config.
      {path: /^\//, methods:['DELETE','PUT']}
    ],
  },
  assets: {
    publicPath: '/public/',
    devServer: {
      debug: true,
      command: 'cross-env REACT_APP_ENV=dev MOCK=none APP_ROOT=$PWD/app/view USE_WEBPACK_5=1 UMI_ENV=dev umi dev',
      port: 8000,
      env: {
        APP_ROOT: path.join(__dirname, 'app/view'),
        BROWSER: 'none',
        ESLINT: 'none',
        SOCKET_SERVER: 'http://127.0.0.1:8000',
        PUBLIC_PATH: 'http://127.0.0.1:8000',
      },
    },
  },
};