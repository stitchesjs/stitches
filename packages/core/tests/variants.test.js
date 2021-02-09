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
				},
			},
			level: {
				1: {
					padding: '0.5em',
				},
				2: {
					padding: '1em',
				},
			},
		},
		compoundVariants: [
			{
				size: 'small',
				color: 'blue',
				css: {
					transform: 'scale(1.2)',
				},
			},
		],
	})

	test('Renders a component without any initial styles', () => {
		component_1 = COMPONENT()
		stylerule_1 = ''

		expect(component_1.className).toBe('sx03kze')
		expect(STITCHES.toString()).toBe(stylerule_1)
	})

	test('Renders a component with 1 matching variant', () => {
		component_2 = COMPONENT({ size: 'small' })
		stylerule_2 = stylerule_1 + '.sx03kzetmy8g--size-small{font-size:16px;}'

		expect(component_2.className).toBe('sx03kze sx03kzetmy8g--size-small')
		expect(STITCHES.toString()).toBe(stylerule_2)

		component_3 = COMPONENT({ color: 'blue' })
		stylerule_3 = stylerule_2 + '.sx03kze4wpam--color-blue{background-color:dodgerblue;color:white;}'

		expect(component_3.className).toBe('sx03kze sx03kze4wpam--color-blue')
		expect(STITCHES.toString()).toBe(stylerule_3)
	})

	test('Renders a component with 2 matching variants', () => {
		component_4 = COMPONENT({ size: 'small', level: 1 })
		stylerule_4 = stylerule_3 + '.sx03kzehmqox--level-1{padding:0.5em;}'

		expect(component_4.className).toBe('sx03kze sx03kzetmy8g--size-small sx03kzehmqox--level-1')
		expect(STITCHES.toString()).toBe(stylerule_4)
	})

	test('Renders a component with a 2 matching variants and 1 matching compound', () => {
		component_5 = COMPONENT({ size: 'small', color: 'blue' })
		stylerule_5 = stylerule_4 + '.sx03kzeif1wl--comp{transform:scale(1.2);}'

		expect(component_5.className).toBe('sx03kze sx03kzeif1wl--comp sx03kzetmy8g--size-small sx03kze4wpam--color-blue')
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
				},
			},
			level: {
				1: {
					padding: '0.5em',
				},
				2: {
					padding: '1em',
				},
			},
		},
		compoundVariants: [
			{
				size: 'small',
				color: 'blue',
				css: {
					transform: 'scale(1.2)',
				},
			},
		],
		defaultVariants: {
			size: 'small',
		},
	})

	test('Renders a component with the default variant applied', () => {
		component_1 = COMPONENT()
		stylerule_1 = '.sx03kzetmy8g--size-small{font-size:16px;}'

		expect(component_1.className).toBe('sx03kze sx03kzetmy8g--size-small')
		expect(STITCHES.toString()).toBe(stylerule_1)
	})

	test('Renders a component with the default variant explicitly applied', () => {
		component_2 = COMPONENT({ size: 'small' })
		stylerule_2 = stylerule_1 + ''

		expect(component_2.className).toBe('sx03kze sx03kzetmy8g--size-small')
		expect(STITCHES.toString()).toBe(stylerule_2)
	})

	test('Renders a component with the non-default variant explicitly applied', () => {
		component_3 = COMPONENT({ size: 'large' })
		stylerule_3 = stylerule_2 + '.sx03kzefhyhx--size-large{font-size:24px;}'

		expect(component_3.className).toBe('sx03kze sx03kzefhyhx--size-large')
		expect(STITCHES.toString()).toBe(stylerule_3)
	})

	test('Renders a component with the default variant applied and a different variant explicitly applied', () => {
		component_4 = COMPONENT({ level: 1 })
		stylerule_4 = stylerule_3 + '.sx03kzehmqox--level-1{padding:0.5em;}'

		expect(component_4.className).toBe('sx03kze sx03kzehmqox--level-1 sx03kzetmy8g--size-small')
		expect(STITCHES.toString()).toBe(stylerule_4)
	})

	test('Renders a component with the default variant applied and a different variant explicitly applied', () => {
		component_4 = COMPONENT({ level: 1 })
		stylerule_4 = stylerule_3 + '.sx03kzehmqox--level-1{padding:0.5em;}'

		expect(component_4.className).toBe('sx03kze sx03kzehmqox--level-1 sx03kzetmy8g--size-small')
		expect(STITCHES.toString()).toBe(stylerule_4)
	})

	test('Renders a component with the default variant applied, a different variant explicitly applied, and a compound applied', () => {
		component_5 = COMPONENT({ color: 'blue' })
		stylerule_5 = stylerule_4 + '.sx03kze4wpam--color-blue{background-color:dodgerblue;color:white;}' + '.sx03kzeif1wl--comp{transform:scale(1.2);}'

		expect(component_5.className).toBe('sx03kze sx03kzeif1wl--comp sx03kze4wpam--color-blue sx03kzetmy8g--size-small')
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
			lg: '@media (min-width: 768px)',
		},
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
				},
			},
			level: {
				1: {
					padding: '0.5em',
				},
				2: {
					padding: '1em',
				},
			},
		},
		compoundVariants: [
			{
				size: 'small',
				color: 'blue',
				css: {
					transform: 'scale(1.2)',
				},
			},
		],
	})

	test('Renders a component with a conditional variant applied', () => {
		component_1 = COMPONENT({ size: { sm: 'small', lg: 'large' } })
		classname_1 = 'sx03kze sx03kzetmy8g--size-small sx03kzetmy8g--size-small--5m2l7 sx03kzefhyhx--size-large sx03kzefhyhx--size-large--8c3r4'
		stylerule_1 = '@media (max-width: 767px){.sx03kzetmy8g--size-small--5m2l7{font-size:16px;}}@media (min-width: 768px){.sx03kzefhyhx--size-large--8c3r4{font-size:24px;}}'

		expect(component_1.className).toBe(classname_1)
		expect(STITCHES.toString()).toBe(stylerule_1)
	})

	test('Renders a component with a conditional variant applied', () => {
		component_2 = COMPONENT({ level: { sm: 1, lg: 2 } })
		classname_2 = 'sx03kze sx03kzehmqox--level-1 sx03kzehmqox--level-1--5m2l7 sx03kzef87fs--level-2 sx03kzef87fs--level-2--8c3r4'
		stylerule_2 = stylerule_1 + '@media (max-width: 767px){.sx03kzehmqox--level-1--5m2l7{padding:0.5em;}}@media (min-width: 768px){.sx03kzef87fs--level-2--8c3r4{padding:1em;}}'

		expect(component_2.className).toBe(classname_2)
		expect(STITCHES.toString()).toBe(stylerule_2)
	})

	test('Renders a component with a conditional compund variant applied', () => {
		component_3 = COMPONENT({ color: 'blue', size: { sm: 'small', lg: 'large' } })
		classname_3 = 'sx03kze sx03kzekclug--comp sx03kze4wpam--color-blue sx03kzetmy8g--size-small sx03kzefhyhx--size-large'
		stylerule_3 = stylerule_2 + '.sx03kze4wpam--color-blue{background-color:dodgerblue;color:white;}@media (max-width: 767px){.sx03kzekclug--comp{transform:scale(1.2);}}'

		expect(component_3.className).toBe(classname_3)
		expect(STITCHES.toString()).toBe(stylerule_3)
	})
})
