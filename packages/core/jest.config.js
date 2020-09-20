const base = require('../../jest.config.base.js');

module.exports = {
  ...base,
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  name: '@atomica/css',
  displayName: 'css',
};
