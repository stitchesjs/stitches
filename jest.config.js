'use strict';
const semver = require('semver');

function getSupportedTypescriptTarget() {
  const nodeVersion = process.versions.node;

  if (semver.gt(nodeVersion, '10.0.0')) {
    return 'es2018';
  } else if (semver.gt(nodeVersion, '7.6.0')) {
    return 'es2017';
  } else if (semver.gt(nodeVersion, '7.0.0')) {
    return 'es2016';
  } else if (semver.gt(nodeVersion, '6.0.0')) {
    return 'es2015';
  } else {
    return 'es5';
  }
}

module.exports = {
  testURL: 'http://localhost',
  preset: 'ts-jest',
  collectCoverageFrom: [
    'src/**/*.{t,j}s?(x)',
    '!src/**/*.d.ts',
  ],
  globals: {
    'ts-jest': {
      tsConfig: {
        target: getSupportedTypescriptTarget(),
      }
    }
  }
};
