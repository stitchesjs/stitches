import { tokenizeValue } from '../src/shorthand-parser/value-tokenizer';

describe('Parse css values into token groups', () => {
  test('falsy value', () => {
    tokenizeValue(undefined as any);
  });

  test('space separated values', () => {
    tokenizeValue('solid red');
  });

  test('space separated values that contain units', () => {
    tokenizeValue('1px 1px');
  });

  test('useless whitespace', () => {
    tokenizeValue(' 1px   1px ');
  });
});
