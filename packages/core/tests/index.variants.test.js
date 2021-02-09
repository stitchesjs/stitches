import createCss from '../src/index.js'

describe('Compound Variants', () => {
	let component
	let component_1, component_2, component_3, component_4, component_5
	let stylerule_1, stylerule_2, stylerule_3, stylerule_4, stylerule_5

	const STITCHES = createCss({})

	/** Component with variants and compound variants */
	const COMPONENT = STITCHES.css({
		variants: {
			color: {
				blue: {
					backgroundColor: 'dodgerblue',
					color: 'white',
				},
				red: {
					backgroundColor: 'tomato',
					color: 'white',
				},
			},
			size: {
				small: {
					fontSize: '16px',
				},
				large: {
					fontSize: '24px',
				}
			},
			level: {
				1: {
					padding: '0.5em',
				},
				2: {
					padding: '1em',
				}
			}
		},
		compounds: [
			[
				{
					size: 'small',
					color: 'blue',
				},
				{
					transform: 'scale(2)',
				}
			]
		]
	})

	test('Renders a component without any initial styles', () => {
		component_1 = COMPONENT()
		stylerule_1 = ''

		expect(component_1.className).toBe('sw03kze')
		expect(STITCHES.toString()).toBe(stylerule_1)
	})

	test('Renders a component with 1 matching variant', () => {
		component_2 = COMPONENT({ size: 'small' })
		stylerule_2 = stylerule_1 + '.sw03kze-ltmy8g--size-small{font-size:16px;}'

		expect(component_2.className).toBe('sw03kze sw03kze-ltmy8g--size-small')
		expect(STITCHES.toString()).toBe(stylerule_2)

		component_3 = COMPONENT({ color: 'blue' })
		stylerule_3 = stylerule_2 + '.sw03kze-14wpam--color-blue{background-color:dodgerblue;color:white;}'

		expect(component_3.className).toBe('sw03kze sw03kze-14wpam--color-blue')
		expect(STITCHES.toString()).toBe(stylerule_3)
	})

	test('Renders a component with 2 matching variants', () => {
		component_4 = COMPONENT({ size: 'small', level: 1 })
		stylerule_4 = stylerule_3 + '.sw03kze-lhmqox--level-1{padding:0.5em;}'

		expect(component_4.className).toBe('sw03kze sw03kze-ltmy8g--size-small sw03kze-lhmqox--level-1')
		expect(STITCHES.toString()).toBe(stylerule_4)
	})

	test('Renders a component with a 2 matching variants and 1 matching compound', () => {
		component_5 = COMPONENT({ size: 'small', color: 'blue' })
		stylerule_5 = stylerule_4 + '.sw03kze-2lqml--comp{transform:scale(2);}'

		expect(component_5.className).toBe('sw03kze sw03kze-2lqml--comp sw03kze-ltmy8g--size-small sw03kze-14wpam--color-blue')
		expect(STITCHES.toString()).toBe(stylerule_5)
	})
})
