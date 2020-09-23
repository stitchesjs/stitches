module.exports = {
  preset: 'ts-jest',
  testRegex: '(/tests/.*|(\\.|/)(test|spec))\\.[jt]sx?$',
  testPathIgnorePatterns: ['/node_modules/', '/dist/'],
  collectCoverageFrom: ['**/*.{t,j}s?(x)', '!**/*.d.ts', '!dist', '!**/dist/**'],
  coveragePathIgnorePatterns: ['/node_modules/', '/dist/', '(tests/.*.mock).(jsx?|tsx?)$'],
  verbose: true,
};
