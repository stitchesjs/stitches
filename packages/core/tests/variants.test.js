import createCss from '../src/index.js'

describe('Variants', () => {
	let component
	let component_1, component_2, component_3, component_4, component_5
	let stylerule_1, stylerule_2, stylerule_3, stylerule_4, stylerule_5

	const STITCHES = createCss()

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
				{ size: 'small', color: 'blue' },
				{
					transform: 'scale(1.2)',
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
		stylerule_5 = stylerule_4 + '.sw03kzeuif1wl--comp{transform:scale(1.2);}'

		expect(component_5.className).toBe('sw03kze sw03kzeuif1wl--comp sw03kze-ltmy8g--size-small sw03kze-14wpam--color-blue')
		expect(STITCHES.toString()).toBe(stylerule_5)
	})
})

describe('Variants with defaults', () => {
	let component
	let component_1, component_2, component_3, component_4, component_5
	let stylerule_1, stylerule_2, stylerule_3, stylerule_4, stylerule_5

	const STITCHES = createCss()

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
				{ size: 'small', color: 'blue' },
				{
					transform: 'scale(1.2)',
				}
			]
		],
		defaults: {
			size: 'small'
		}
	})

	test('Renders a component with the default variant applied', () => {
		component_1 = COMPONENT()
		stylerule_1 = '.sw03kze-ltmy8g--size-small{font-size:16px;}'

		expect(component_1.className).toBe('sw03kze sw03kze-ltmy8g--size-small')
		expect(STITCHES.toString()).toBe(stylerule_1)
	})

	test('Renders a component with the default variant explicitly applied', () => {
		component_2 = COMPONENT({ size: 'small' })
		stylerule_2 = stylerule_1 + ''

		expect(component_2.className).toBe('sw03kze sw03kze-ltmy8g--size-small')
		expect(STITCHES.toString()).toBe(stylerule_2)
	})

	test('Renders a component with the non-default variant explicitly applied', () => {
		component_3 = COMPONENT({ size: 'large' })
		stylerule_3 = stylerule_2 + '.sw03kzejfhyhx--size-large{font-size:24px;}'

		expect(component_3.className).toBe('sw03kze sw03kzejfhyhx--size-large')
		expect(STITCHES.toString()).toBe(stylerule_3)
	})

	test('Renders a component with the default variant applied and a different variant explicitly applied', () => {
		component_4 = COMPONENT({ level: 1 })
		stylerule_4 = stylerule_3 + '.sw03kze-lhmqox--level-1{padding:0.5em;}'

		expect(component_4.className).toBe('sw03kze sw03kze-lhmqox--level-1 sw03kze-ltmy8g--size-small')
		expect(STITCHES.toString()).toBe(stylerule_4)
	})

	test('Renders a component with the default variant applied and a different variant explicitly applied', () => {
		component_4 = COMPONENT({ level: 1 })
		stylerule_4 = stylerule_3 + '.sw03kze-lhmqox--level-1{padding:0.5em;}'

		expect(component_4.className).toBe('sw03kze sw03kze-lhmqox--level-1 sw03kze-ltmy8g--size-small')
		expect(STITCHES.toString()).toBe(stylerule_4)
	})

	test('Renders a component with the default variant applied, a different variant explicitly applied, and a compound applied', () => {
		component_5 = COMPONENT({ color: 'blue' })
		stylerule_5 = stylerule_4 + '.sw03kzeuif1wl--comp{transform:scale(1.2);}' + '.sw03kze-14wpam--color-blue{background-color:dodgerblue;color:white;}'

		expect(component_5.className).toBe('sw03kze sw03kzeuif1wl--comp sw03kze-14wpam--color-blue sw03kze-ltmy8g--size-small')
		expect(STITCHES.toString()).toBe(stylerule_5)
	})
})

describe('Conditional variants', () => {
	let component
	let component_1, component_2, component_3
	let classname_1, classname_2, classname_3
	let stylerule_1, stylerule_2, stylerule_3

	const STITCHES = createCss({
		conditions: {
			sm: '@media (max-width: 767px)',
			lg: '@media (min-width: 768px)'
		}
	})

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
				{ size: 'small', color: 'blue' },
				{
					transform: 'scale(1.2)',
				}
			]
		],
	})

	test('Renders a component with a conditional variant applied', () => {
		component_1 = COMPONENT({ size: { sm: 'small', lg: 'large' }})
		classname_1 = 'sw03kze sw03kze-ltmy8g--size-small sw03kze-ltmy8g--size-small--n5m2l7 sw03kzejfhyhx--size-large sw03kzejfhyhx--size-large--f8c3r4'
		stylerule_1 = '@media (max-width: 767px){.sw03kze-ltmy8g--size-small--n5m2l7{font-size:16px;}}@media (min-width: 768px){.sw03kzejfhyhx--size-large--f8c3r4{font-size:24px;}}'

		expect(component_1.className).toBe(classname_1)
		expect(STITCHES.toString()).toBe(stylerule_1)
	})

	test('Renders a component with a conditional variant applied', () => {
		component_2 = COMPONENT({ level: { sm: 1, lg: 2 }})
		classname_2 = 'sw03kze sw03kze-lhmqox--level-1 sw03kze-lhmqox--level-1--n5m2l7 sw03kze-tf87fs--level-2 sw03kze-tf87fs--level-2--f8c3r4'
		stylerule_2 = stylerule_1 + '@media (max-width: 767px){.sw03kze-lhmqox--level-1--n5m2l7{padding:0.5em;}}@media (min-width: 768px){.sw03kze-tf87fs--level-2--f8c3r4{padding:1em;}}'

		expect(component_2.className).toBe(classname_2)
		expect(STITCHES.toString()).toBe(stylerule_2)
	})

	test('Renders a component with a conditional compund variant applied', () => {
		component_3 = COMPONENT({ color: 'blue', size: { sm: 'small', lg: 'large' }})
		classname_3 = 'sw03kze sw03kzeuif1wl--comp sw03kze-14wpam--color-blue sw03kze-ltmy8g--size-small sw03kzejfhyhx--size-large'
		stylerule_3 = stylerule_2 + '@media (max-width: 767px){.sw03kzeuif1wl--comp{transform:scale(1.2);}}' + '.sw03kze-14wpam--color-blue{background-color:dodgerblue;color:white;}'

		expect(component_3.className).toBe(classname_3)
		expect(STITCHES.toString()).toBe(stylerule_3)
	})
})
