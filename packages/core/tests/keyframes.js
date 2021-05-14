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
		expect(`animation: 1s ${myKeyframes};`).toBe('animation: 1s k-hMEmNJ;')
		expect(toString()).toBe(`--stitches{--:1 k-hMEmNJ}@media{@keyframes k-hMEmNJ{0%{opacity:0}1%{opacity:1}}}`)
		expect(myKeyframes.name).toBe('k-hMEmNJ')
	})
})
