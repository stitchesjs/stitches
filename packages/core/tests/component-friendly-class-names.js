import { createStitches } from '../src/index.js'

describe('Generate human-legible class names', () => {
	test('Class name includes "wrapper"', () => {
		const { css } = createStitches()

		const wrapper = css({}, "wrapper")
		expect(wrapper.className).toBe('c-wrapper-PJLV')
	})

	test('Class name includes "heading"', () => {
		const { css } = createStitches()

		const heading = css({}, "heading")
		expect(heading.className).toBe('c-heading-PJLV')
	})
})
