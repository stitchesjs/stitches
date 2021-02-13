import createCss from '../src/index.js'

describe('Variants', () => {
	let component_1, component_2, component_3, component_4, component_5
	let stylerule_1, stylerule_2, stylerule_3, stylerule_4, stylerule_5

	const { css, toString } = createCss()

	/** Component with variants and compound variants */
	const COMPONENT = css({
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
		expect(toString()).toBe(stylerule_1)
	})

	test('Renders a component with 1 matching variant', () => {
		component_2 = COMPONENT({ size: 'small' })
		stylerule_2 = stylerule_1 + '.sx03kzetmy8g--size-small{font-size:16px;}'

		expect(component_2.className).toBe('sx03kze sx03kzetmy8g--size-small')
		expect(toString()).toBe(stylerule_2)

		component_3 = COMPONENT({ color: 'blue' })
		stylerule_3 = stylerule_2 + '.sx03kze4wpam--color-blue{background-color:dodgerblue;color:white;}'

		expect(component_3.className).toBe('sx03kze sx03kze4wpam--color-blue')
		expect(toString()).toBe(stylerule_3)
	})

	test('Renders a component with 2 matching variants', () => {
		component_4 = COMPONENT({ size: 'small', level: 1 })
		stylerule_4 = stylerule_3 + '.sx03kzehmqox--level-1{padding:0.5em;}'

		expect(component_4.className).toBe('sx03kze sx03kzetmy8g--size-small sx03kzehmqox--level-1')
		expect(toString()).toBe(stylerule_4)
	})

	test('Renders a component with a 2 matching variants and 1 matching compound', () => {
		component_5 = COMPONENT({ size: 'small', color: 'blue' })
		stylerule_5 = stylerule_4 + '.sx03kzeif1wl--comp{transform:scale(1.2);}'

		expect(component_5.className).toBe('sx03kze sx03kzeif1wl--comp sx03kzetmy8g--size-small sx03kze4wpam--color-blue')
		expect(toString()).toBe(stylerule_5)
	})
})

describe('Variants with defaults', () => {
	let component_1, component_2, component_3, component_4, component_5
	let stylerule_1, stylerule_2, stylerule_3, stylerule_4, stylerule_5

	const STITCHES = createCss()

	/** Component with variants and compound variants */
	const component = STITCHES.css({
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
		component_1 = component()
		stylerule_1 = '.sx03kzetmy8g--size-small{font-size:16px;}'

		expect(component_1.className).toBe('sx03kze sx03kzetmy8g--size-small')
		expect(STITCHES.toString()).toBe(stylerule_1)
	})

	test('Renders a component with the default variant explicitly applied', () => {
		component_2 = component({ size: 'small' })
		stylerule_2 = stylerule_1 + ''

		expect(component_2.className).toBe('sx03kze sx03kzetmy8g--size-small')
		expect(STITCHES.toString()).toBe(stylerule_2)
	})

	test('Renders a component with the non-default variant explicitly applied', () => {
		component_3 = component({ size: 'large' })
		stylerule_3 = stylerule_2 + '.sx03kzefhyhx--size-large{font-size:24px;}'

		expect(component_3.className).toBe('sx03kze sx03kzefhyhx--size-large')
		expect(STITCHES.toString()).toBe(stylerule_3)
	})

	test('Renders a component with the default variant applied and a different variant explicitly applied', () => {
		component_4 = component({ level: 1 })
		stylerule_4 = stylerule_3 + '.sx03kzehmqox--level-1{padding:0.5em;}'

		expect(component_4.className).toBe('sx03kze sx03kzehmqox--level-1 sx03kzetmy8g--size-small')
		expect(STITCHES.toString()).toBe(stylerule_4)
	})

	test('Renders a component with the default variant applied and a different variant explicitly applied', () => {
		component_4 = component({ level: 1 })
		stylerule_4 = stylerule_3 + '.sx03kzehmqox--level-1{padding:0.5em;}'

		expect(component_4.className).toBe('sx03kze sx03kzehmqox--level-1 sx03kzetmy8g--size-small')
		expect(STITCHES.toString()).toBe(stylerule_4)
	})

	test('Renders a component with the default variant applied, a different variant explicitly applied, and a compound applied', () => {
		component_5 = component({ color: 'blue' })
		stylerule_5 = stylerule_4 + '.sx03kze4wpam--color-blue{background-color:dodgerblue;color:white;}' + '.sx03kzeif1wl--comp{transform:scale(1.2);}'

		expect(component_5.className).toBe('sx03kze sx03kzeif1wl--comp sx03kze4wpam--color-blue sx03kzetmy8g--size-small')
		expect(STITCHES.toString()).toBe(stylerule_5)
	})
})

describe('Conditional variants', () => {
	const config = {
		conditions: {
			bp1: '@media (max-width: 767px)',
			bp2: '@media (min-width: 768px)',
		},
	}

	/** Component with variants and compound variants */
	const componentConfig = {
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
	}

	test('Renders a component with no variant applied', () => {
		const { css, toString } = createCss(config)
		const component = css(componentConfig)
		const componentClassName = 'sx03kze'

		expect(component().className).toBe(componentClassName)
		expect(toString()).toBe('')
	})

	test('Renders a component with one variant applied', () => {
		const { css, toString } = createCss(config)
		const component = css(componentConfig)
		const componentClassName = `sx03kze`
		const componentSmallClassName = `${componentClassName}tmy8g--size-small`
		const componentSmallCssText = `.${componentSmallClassName}{font-size:16px;}`

		expect(component({ size: 'small' }).className).toBe([componentClassName, componentSmallClassName].join(' '))
		expect(toString()).toBe(componentSmallCssText)
	})

	test('Renders a component with one conditional variant on one breakpoint applied', () => {
		const { css, toString } = createCss(config)
		const component = css(componentConfig)
		const componentClassName = `sx03kze`
		const componentSmallBp1ClassName = `${componentClassName}tmy8g--size-small--5m2l7`
		const componentSmallBp1CssText = `@media (max-width: 767px){.${componentSmallBp1ClassName}{font-size:16px;}}`

		expect(component({ size: { bp1: 'small' } }).className).toBe([componentClassName, componentSmallBp1ClassName].join(' '))
		expect(toString()).toBe(componentSmallBp1CssText)
	})

	test('Renders a component with one conditional variant on two breakpoints applied', () => {
		const { css, toString } = createCss(config)
		const component = css(componentConfig)
		const componentClassName = `sx03kze`
		const componentSmallBp1ClassName = `${componentClassName}tmy8g--size-small--5m2l7`
		const componentLargeBp2ClassName = `${componentClassName}fhyhx--size-large--8c3r4`
		const componentSmallBp1CssText = `@media (max-width: 767px){.${componentSmallBp1ClassName}{font-size:16px;}}`
		const componentLargeBp2CssText = `@media (min-width: 768px){.sx03kzefhyhx--size-large--8c3r4{font-size:24px;}}`

		expect(component({ size: { bp1: 'small', bp2: 'large' } }).className).toBe([componentClassName, componentSmallBp1ClassName, componentLargeBp2ClassName].join(' '))
		expect(toString()).toBe([componentSmallBp1CssText, componentLargeBp2CssText].join(''))
	})
})
