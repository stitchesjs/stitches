import { createCss } from '../src/index.js'

describe('Keyframes', () => {
	test('Expected behavior for the keyframes() method', () => {
		const { keyframes, toString } = createCss()

		const myKeyframes = keyframes({
			'0%': {
				opacity: '0',
			},
			'1%': {
				opacity: '1',
			},
		})

		expect(toString()).toBe('')
		expect(`animation: 1s ${myKeyframes};`).toBe('animation: 1s sxk7pfs;')
		expect(toString()).toBe('@keyframes sxk7pfs{0%{opacity:0;}1%{opacity:1;}}')
		expect(myKeyframes.name).toBe('sxk7pfs')
	})
})
