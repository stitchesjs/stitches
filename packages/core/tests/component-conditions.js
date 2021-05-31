import { createCss } from '../src/index.js'

describe('Component Medias', () => {
	test('Authors can define medias applied to components', () => {
		const { css, toString } = createCss({
			media: {
				mediumUp: '(width >= 768px)',
			},
		})

		css({
			'fontSize': '16px',
			'@mediumUp': {
				fontSize: '24px',
			},
		})()

		expect(toString()).toBe(
			`--stitches{--:2 c-jEGvho}@media{` +
				`.c-jEGvho{font-size:16px}` +
				`@media (min-width:768px){.c-jEGvho{font-size:24px}}` +
			`}`,
		)
	})
}) // prettier-ignore
