import createCss from '../src/index.js'

describe('Variants', () => {
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

	test('Renders a component without any initial styles', () => {
		const { styled, toString } = createCss()
		const component = styled('div', componentConfig)
		const expression = component.render()

		expect(expression.props.className).toBe('sx03kze')
		expect(toString()).toBe('')
	})

	test('Renders a component with 1 matching variant', () => {
		const { styled, toString } = createCss()
		const component = styled('div', componentConfig)
		const expression1 = component.render({ size: 'small' })

		const expression1CssText = '.sx03kzetmy8g--size-small{font-size:16px;}'

		expect(expression1.props.className).toBe('sx03kze sx03kzetmy8g--size-small')
		expect(toString()).toBe(expression1CssText)

		const expression2 = component.render({ color: 'blue' })

		const expression2CssText = '.sx03kze4wpam--color-blue{background-color:dodgerblue;color:white;}'

		expect(expression2.props.className).toBe('sx03kze sx03kze4wpam--color-blue')
		expect(toString()).toBe(expression1CssText + expression2CssText)
	})

	test('Renders a component with 2 matching variants', () => {
		const { styled, toString } = createCss()
		const component = styled('div', componentConfig)
		const expression = component.render({ size: 'small', level: 1 })

		expect(expression.props.className).toBe('sx03kze sx03kzetmy8g--size-small sx03kzehmqox--level-1')

		const expressionSizeSmallCssText = '.sx03kzetmy8g--size-small{font-size:16px;}'
		const expressionLevel1CssText = '.sx03kzehmqox--level-1{padding:0.5em;}'

		expect(toString()).toBe(expressionSizeSmallCssText + expressionLevel1CssText)
	})

	test('Renders a component with a 2 matching variants and 1 matching compound', () => {
		const { styled, toString } = createCss()
		const component = styled('div', componentConfig)
		const expression = component.render({ size: 'small', color: 'blue' })

		const expressionSizeSmallCssText = '.sx03kzetmy8g--size-small{font-size:16px;}'
		const expressionColorBlueCssText = '.sx03kze4wpam--color-blue{background-color:dodgerblue;color:white;}'
		const expressionCompoundCssText = '.sx03kzeif1wl--comp{transform:scale(1.2);}'

		expect(expression.props.className).toBe('sx03kze sx03kzeif1wl--comp sx03kzetmy8g--size-small sx03kze4wpam--color-blue')
		expect(toString()).toBe(expressionSizeSmallCssText + expressionColorBlueCssText + expressionCompoundCssText)
	})
})

describe('Variants with defaults', () => {
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
		defaultVariants: {
			size: 'small',
		},
	}

	test('Renders a component with the default variant applied', () => {
		const { styled, toString } = createCss()
		const component = styled('div', componentConfig)
		const expression = component.render()

		expect(expression.props.className).toBe('sx03kze sx03kzetmy8g--size-small')
		expect(toString()).toBe('.sx03kzetmy8g--size-small{font-size:16px;}')
	})

	test('Renders a component with the default variant explicitly applied', () => {
		const { styled, toString } = createCss()
		const component = styled('div', componentConfig)
		const expression = component.render({ size: 'small' })

		expect(expression.props.className).toBe('sx03kze sx03kzetmy8g--size-small')
		expect(toString()).toBe('.sx03kzetmy8g--size-small{font-size:16px;}')
	})

	test('Renders a component with the non-default variant explicitly applied', () => {
		const { styled, toString } = createCss()
		const component = styled('div', componentConfig)
		const expression = component.render({ size: 'large' })

		expect(expression.props.className).toBe('sx03kze sx03kzefhyhx--size-large')
		expect(toString()).toBe('.sx03kzefhyhx--size-large{font-size:24px;}')
	})

	test('Renders a component with the default variant applied and a different variant explicitly applied', () => {
		const { styled, toString } = createCss()
		const component = styled('div', componentConfig)
		const expression = component.render({ level: 1 })

		expect(expression.props.className).toBe('sx03kze sx03kzehmqox--level-1 sx03kzetmy8g--size-small')
		expect(toString()).toBe(
			[
				// explicit level:1
				'.sx03kzehmqox--level-1{padding:0.5em;}',
				// implicit size:small
				'.sx03kzetmy8g--size-small{font-size:16px;}',
			].join(''),
		)
	})

	test('Renders a component with the default variant applied, a different variant explicitly applied, and a compound applied', () => {
		const { styled, toString } = createCss()
		const component = styled('div', componentConfig)
		const expression = component.render({ color: 'blue' })

		expect(expression.props.className).toBe('sx03kze sx03kzeif1wl--comp sx03kze4wpam--color-blue sx03kzetmy8g--size-small')
		expect(toString()).toBe(
			[
				// explicit color:blue
				'.sx03kze4wpam--color-blue{background-color:dodgerblue;color:white;}',
				// implicit size:small
				'.sx03kzetmy8g--size-small{font-size:16px;}',
				// compound color:blue + size:small
				'.sx03kzeif1wl--comp{transform:scale(1.2);}',
			].join(''),
		)
	})

	test('Returns a component selector without the default variant applied when toString is used', () => {
		const { styled, toString } = createCss()
		const component = styled('div', componentConfig)
		const selector = component.toString()

		expect(selector).toBe('.sx03kze')
		expect(toString()).toBe(
			[
				// implicit size:small
				'.sx03kzetmy8g--size-small{font-size:16px;}',
			].join(''),
		)
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
		const { styled, toString } = createCss(config)
		const component = styled('div', componentConfig)
		const componentClassName = 'sx03kze'

		expect(component.render().props.className).toBe(componentClassName)
		expect(toString()).toBe('')
	})

	test('Renders a component with one variant applied', () => {
		const { styled, toString } = createCss(config)
		const component = styled('div', componentConfig)
		const componentClassName = `sx03kze`
		const componentSmallClassName = `${componentClassName}tmy8g--size-small`
		const componentSmallCssText = `.${componentSmallClassName}{font-size:16px;}`

		expect(component.render({ size: 'small' }).props.className).toBe([componentClassName, componentSmallClassName].join(' '))
		expect(toString()).toBe(componentSmallCssText)
	})

	test('Renders a component with one conditional variant on one breakpoint applied', () => {
		const { styled, toString } = createCss(config)
		const component = styled('div', componentConfig)
		const componentClassName = `sx03kze`
		const componentSmallBp1ClassName = `${componentClassName}tmy8g--size-small--5m2l7`
		const componentSmallBp1CssText = `@media (max-width: 767px){.${componentSmallBp1ClassName}{font-size:16px;}}`

		expect(component.render({ size: { bp1: 'small' } }).props.className).toBe([componentClassName, componentSmallBp1ClassName].join(' '))
		expect(toString()).toBe(componentSmallBp1CssText)
	})

	test('Renders a component with one conditional variant on two breakpoints applied', () => {
		const { styled, toString } = createCss(config)
		const component = styled('div', componentConfig)
		const componentClassName = `sx03kze`
		const componentSmallBp1ClassName = `${componentClassName}tmy8g--size-small--5m2l7`
		const componentLargeBp2ClassName = `${componentClassName}fhyhx--size-large--8c3r4`
		const componentSmallBp1CssText = `@media (max-width: 767px){.${componentSmallBp1ClassName}{font-size:16px;}}`
		const componentLargeBp2CssText = `@media (min-width: 768px){.sx03kzefhyhx--size-large--8c3r4{font-size:24px;}}`

		expect(component.render({ size: { bp1: 'small', bp2: 'large' } }).props.className).toBe([componentClassName, componentSmallBp1ClassName, componentLargeBp2ClassName].join(' '))
		expect(toString()).toBe([componentSmallBp1CssText, componentLargeBp2CssText].join(''))
	})

	test('Renders a component with a conditional variant repeatedly', () => {
		const { styled, toString } = createCss(config)
		const component = styled('div', componentConfig)
		const componentClassName = `sx03kze`
		const componentSmallBp1ClassName = `${componentClassName}tmy8g--size-small--5m2l7`
		const componentLargeBp2ClassName = `${componentClassName}fhyhx--size-large--8c3r4`
		const componentSmallBp1CssText = `@media (max-width: 767px){.${componentSmallBp1ClassName}{font-size:16px;}}`
		const componentLargeBp2CssText = `@media (min-width: 768px){.sx03kzefhyhx--size-large--8c3r4{font-size:24px;}}`

		expect(component.render({ size: { bp1: 'small', bp2: 'large' } }).props.className).toBe([componentClassName, componentSmallBp1ClassName, componentLargeBp2ClassName].join(' '))
		expect(toString()).toBe([componentSmallBp1CssText, componentLargeBp2CssText].join(''))

		expect(component.render({ size: { bp1: 'small', bp2: 'large' } }).props.className).toBe([componentClassName, componentSmallBp1ClassName, componentLargeBp2ClassName].join(' '))
		expect(toString()).toBe([componentSmallBp1CssText, componentLargeBp2CssText].join(''))

		expect(component.render({ size: { bp1: 'small', bp2: 'large' } }).props.className).toBe([componentClassName, componentSmallBp1ClassName, componentLargeBp2ClassName].join(' '))
		expect(toString()).toBe([componentSmallBp1CssText, componentLargeBp2CssText].join(''))
	})
})
