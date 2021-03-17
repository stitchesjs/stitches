import createCss from '../src/index.js'

describe('Component Medias', () => {
	test('Authors can define medias applied to components', () => {
		const { css, toString } = createCss({
			media: {
				mediumUp: '(width >= 768px)',
			},
		})

		css({
			fontSize: '16px',
			'@when mediumUp': {
				fontSize: '24px',
			},
		})()

		expect(toString()).toBe(`.sx6dwap{font-size:16px;}@media (min-width:768px){.sx6dwap{font-size:24px;}}`)
	})
})
