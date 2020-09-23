const base = require('../../jest.config.base.js');
const packageJson = require('./package.json');

module.exports = {
  ...base,
  roots: ['<rootDir>/src', '<rootDir>/tests'],
  displayName: packageJson.name,
};
