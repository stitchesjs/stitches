const base = require('../../jest.config.base.js');

module.exports = {
  ...base,
  name: '@atomica/css',
  displayName: 'css',
  transform: {
    '\\.ts?x$': ['babel-jest', { cwd: __dirname }],
  },
};
