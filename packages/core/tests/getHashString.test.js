import getHashString from '../src/getHashString.js'

describe('getHashString()', () => {
	test('getHashString() consistently returns the same unique hash', () => {
		expect(getHashString('sx', { abcdefg: 1234567 })).toBe('sxyd7kp')
		expect(getHashString('sx', { abcdefg: 1234567 })).toBe('sxyd7kp')
		expect(getHashString('sx', { abcdefg: 1234567 })).toBe('sxyd7kp')
	})

	test('getHashString() returns unique hashes for different values', () => {
		expect(getHashString('sx', { bcdefg: 1234567 })).toBe('sxm2oze')
		expect(getHashString('sx', { bcdefga: 1234567 })).toBe('sx1y2p7')
		expect(getHashString('sx', { abcdefg: 234567 })).toBe('sxg06gj')
		expect(getHashString('sx', { abcdefg: 2345671 })).toBe('sxy5gmp')
		expect(getHashString('sx', { 1234567: 'abcdefg' })).toBe('sxynwz4')
		expect(getHashString('sx', { abcdefg: 1234567, 1234567: 'abcdefg' })).toBe('sxeaee5')
	})
})
