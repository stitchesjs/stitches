import { toCamelCase, toKebabCase } from '../src/toCase.js'

describe('toCase', () => {
	test('toCamelCase', () => {
		expect(toCamelCase('asdf')).toBe('asdf')
		expect(toCamelCase('asdf-qwerty')).toBe('asdfQwerty')
		expect(toCamelCase('asdfQwerty')).toBe('asdfQwerty')
		expect(toCamelCase('-asdfqwerty')).toBe('Asdfqwerty')
		expect(toCamelCase('asdfqwerty-')).toBe('asdfqwerty-')
		expect(toCamelCase('-asdfQwerty')).toBe('-asdfQwerty')
		expect(toCamelCase('asdfQwerty-')).toBe('asdfQwerty-')
	})

	test('toKebabCase', () => {
		expect(toKebabCase('asdf')).toBe('asdf')
		expect(toKebabCase('asdf-qwerty')).toBe('asdf-qwerty')
		expect(toKebabCase('asdfQwerty')).toBe('asdf-qwerty')
		expect(toKebabCase('-asdfqwerty')).toBe('-asdfqwerty')
		expect(toCamelCase('asdfqwerty-')).toBe('asdfqwerty-')
		expect(toKebabCase('-asdfQwerty')).toBe('-asdfQwerty')
		expect(toKebabCase('asdfQwerty-')).toBe('asdfQwerty-')
	})
})
