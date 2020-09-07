const semver = require("semver");

function getSupportedTypescriptTarget() {
  const nodeVersion = process.versions.node;

  if (semver.gt(nodeVersion, "10.0.0")) {
    return "es2018";
  } else if (semver.gt(nodeVersion, "7.6.0")) {
    return "es2017";
  } else if (semver.gt(nodeVersion, "7.0.0")) {
    return "es2016";
  } else if (semver.gt(nodeVersion, "6.0.0")) {
    return "es2015";
  } else {
    return "es5";
  }
}

module.exports = {
  roots: ["<rootDir>/src", "<rootDir>/tests"],
  testURL: "http://localhost",
  testRegex: "(/tests/.*.(test|spec)).(jsx?|tsx?)$",
  moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json", "node"],
  collectCoverageFrom: ["src/**/*.{t,j}s?(x)", "!src/**/*.d.ts"],
  collectCoverage: true,
  coveragePathIgnorePatterns: ["(tests/.*.mock).(jsx?|tsx?)$"],
  verbose: true,
  transform: { '^.+\\.(t|j)sx?$': ['@swc-node/jest', { target: getSupportedTypescriptTarget() }] },
};
