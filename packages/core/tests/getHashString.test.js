import getHashString from '../src/getHashString.js'

describe('getHashString()', () => {
	test('getHashString() consistently returns the same unique hash', () => {
		expect(getHashString('s', { abcdefg: 1234567 })).toBe('siyd7kp')
		expect(getHashString('s', { abcdefg: 1234567 })).toBe('siyd7kp')
		expect(getHashString('s', { abcdefg: 1234567 })).toBe('siyd7kp')
	})

	test('getHashString() returns unique hashes for different values', () => {
		expect(getHashString('s', { bcdefg: 1234567 })).toBe('s-qm2oze')
		expect(getHashString('s', { bcdefga: 1234567 })).toBe('s-91y2p7')
		expect(getHashString('s', { abcdefg: 234567 })).toBe('s5g06gj')
		expect(getHashString('s', { abcdefg: 2345671 })).toBe('syy5gmp')
		expect(getHashString('s', { 1234567: 'abcdefg' })).toBe('s-1ynwz4')
		expect(getHashString('s', { abcdefg: 1234567, 1234567: 'abcdefg' })).toBe('sneaee5')
	})
})
