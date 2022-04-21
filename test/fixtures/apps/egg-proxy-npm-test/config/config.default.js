'use strict';

const path = require('path');
exports.keys = '123456';

exports.npmProxy = {
  baseDir: path.join(__dirname, '../tmp_node_modules'),
};

exports.security = {
  csrf: {
    enabled: false,
    supportedRequests: [        // supported URL path and method, the package will match URL path regex patterns one by one until path matched. We recommend you set {path: /^\//, methods:['POST','PATCH','DELETE','PUT','CONNECT']} as the last rule in the list, which is also the default config.
      {path: /^\//, methods:['DELETE','PUT']}
    ],
  },
};