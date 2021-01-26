import isDeclaration from '../src/isDeclaration'

describe('isDeclaration()', () => {
	test('isDeclaration() correctly identifies some declarations', () => {
		expect(isDeclaration('1')).toBe(true)
		expect(isDeclaration(1)).toBe(true)
		expect(isDeclaration(Object.assign(() => {}, { toString: () => '1' }))).toBe(true)
		expect(isDeclaration(Object.assign(() => {}, { toString: () => 1 }))).toBe(true)
		expect(isDeclaration(Object('1'))).toBe(true)
		expect(isDeclaration(Object(1))).toBe(true)
	})

	test('isDeclaration() correctly identifies some non-declarations', () => {
		expect(isDeclaration({})).toBe(false)
		expect(isDeclaration(Object.create(null))).toBe(false)
		expect(isDeclaration(Object.create(Object.prototype))).toBe(false)
		expect(isDeclaration(Object.create({ toString: () => '1' }))).toBe(false)
		expect(isDeclaration(Object.create({ toString: () => 1 }))).toBe(false)
	})
})
