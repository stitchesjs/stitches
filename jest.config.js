const base = require('./jest.config.base.js');

module.exports = {
  ...base,
  projects: ['<rootDir>/packages/*'],
  coverageDirectory: '<rootDir>/coverage/',
};
