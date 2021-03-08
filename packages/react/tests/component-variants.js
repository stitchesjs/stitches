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

		expect(expression.props.className).toBe('sx03kz9')
		expect(toString()).toBe('')
	})

	test('Renders a component with 1 matching variant', () => {
		const { styled, toString } = createCss()
		const component = styled('div', componentConfig)
		const expression1 = component.render({ size: 'small' })

		const expression1CssText = '.sx03kz9tmy8g--size-small{font-size:16px;}'

		expect(expression1.props.className).toBe('sx03kz9 sx03kz9tmy8g--size-small')
		expect(toString()).toBe(expression1CssText)

		const expression2 = component.render({ color: 'blue' })

		const expression2CssText = '.sx03kz94wpam--color-blue{background-color:dodgerblue;color:white;}'

		expect(expression2.props.className).toBe('sx03kz9 sx03kz94wpam--color-blue')
		expect(toString()).toBe(expression1CssText + expression2CssText)
	})

	test('Renders a component with 2 matching variants', () => {
		const { styled, toString } = createCss()
		const component = styled('div', componentConfig)
		const expression = component.render({ size: 'small', level: 1 })

		expect(expression.props.className).toBe('sx03kz9 sx03kz9tmy8g--size-small sx03kz9hmqox--level-1')

		const expressionSizeSmallCssText = '.sx03kz9tmy8g--size-small{font-size:16px;}'
		const expressionLevel1CssText = '.sx03kz9hmqox--level-1{padding:0.5em;}'

		expect(toString()).toBe(expressionSizeSmallCssText + expressionLevel1CssText)
	})

	test('Renders a component with a 2 matching variants and 1 matching compound', () => {
		const { styled, toString } = createCss()
		const component = styled('div', componentConfig)
		const expression = component.render({ size: 'small', color: 'blue' })

		const expressionSizeSmallCssText = '.sx03kz9tmy8g--size-small{font-size:16px;}'
		const expressionColorBlueCssText = '.sx03kz94wpam--color-blue{background-color:dodgerblue;color:white;}'
		const expressionCompoundCssText = '.sx03kz9if1wl--c2{transform:scale(1.2);}'

		expect(expression.props.className).toBe('sx03kz9 sx03kz94wpam--color-blue sx03kz9tmy8g--size-small sx03kz9if1wl--c2')
		expect(toString()).toBe(expressionColorBlueCssText + expressionSizeSmallCssText + expressionCompoundCssText)
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

		expect(expression.props.className).toBe('sx03kz9 sx03kz9tmy8g--size-small')
		expect(toString()).toBe('.sx03kz9tmy8g--size-small{font-size:16px;}')
	})

	test('Renders a component with the default variant explicitly applied', () => {
		const { styled, toString } = createCss()
		const component = styled('div', componentConfig)
		const expression = component.render({ size: 'small' })

		expect(expression.props.className).toBe('sx03kz9 sx03kz9tmy8g--size-small')
		expect(toString()).toBe('.sx03kz9tmy8g--size-small{font-size:16px;}')
	})

	test('Renders a component with the non-default variant explicitly applied', () => {
		const { styled, toString } = createCss()
		const component = styled('div', componentConfig)
		const expression = component.render({ size: 'large' })

		expect(expression.props.className).toBe('sx03kz9 sx03kz9fhyhx--size-large')
		expect(toString()).toBe('.sx03kz9fhyhx--size-large{font-size:24px;}')
	})

	test('Renders a component with the default variant applied and a different variant explicitly applied', () => {
		const { styled, toString } = createCss()
		const component = styled('div', componentConfig)
		const expression = component.render({ level: 1 })

		expect(expression.props.className).toBe('sx03kz9 sx03kz9tmy8g--size-small sx03kz9hmqox--level-1')
		expect(toString()).toBe(
			[
				// implicit size:small
				'.sx03kz9tmy8g--size-small{font-size:16px;}',
				// explicit level:1
				'.sx03kz9hmqox--level-1{padding:0.5em;}',
			].join(''),
		)
	})

	test('Renders a component with the default variant applied, a different variant explicitly applied, and a compound applied', () => {
		const { styled, toString } = createCss()
		const component = styled('div', componentConfig)
		const expression = component.render({ color: 'blue' })

		expect(expression.props.className).toBe('sx03kz9 sx03kz94wpam--color-blue sx03kz9tmy8g--size-small sx03kz9if1wl--c2')
		expect(toString()).toBe(
			[
				// explicit color:blue
				'.sx03kz94wpam--color-blue{background-color:dodgerblue;color:white;}',
				// implicit size:small
				'.sx03kz9tmy8g--size-small{font-size:16px;}',
				// compound color:blue + size:small
				'.sx03kz9if1wl--c2{transform:scale(1.2);}',
			].join(''),
		)
	})

	test('Returns a component selector without the default variant applied when toString is used', () => {
		const { styled, toString } = createCss()
		const component = styled('div', componentConfig)
		const selector = component.toString()

		expect(selector).toBe('.sx03kz9')
		expect(toString()).toBe('')
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
		const componentClassName = 'sx03kz9'

		expect(component.render().props.className).toBe(componentClassName)
		expect(toString()).toBe('')
	})

	test('Renders a component with one variant applied', () => {
		const { styled, toString } = createCss(config)
		const component = styled('div', componentConfig)
		const componentClassName = `sx03kz9`
		const componentSmallClassName = `${componentClassName}tmy8g--size-small`
		const componentSmallCssText = `.${componentSmallClassName}{font-size:16px;}`

		expect(component.render({ size: 'small' }).props.className).toBe([componentClassName, componentSmallClassName].join(' '))
		expect(toString()).toBe(componentSmallCssText)
	})

	test('Renders a component with one conditional variant on one breakpoint applied', () => {
		const { styled, toString } = createCss(config)
		const component = styled('div', componentConfig)
		const componentClassName = `sx03kz9`
		const componentSmallBp1ClassName = `${componentClassName}iopr7--size-small`
		const componentSmallBp1CssText = `@media (max-width: 767px){.${componentSmallBp1ClassName}{font-size:16px;}}`

		expect(component.render({ size: { bp1: 'small' } }).props.className).toBe([componentClassName, componentSmallBp1ClassName].join(' '))
		expect(toString()).toBe(componentSmallBp1CssText)
	})

	test('Renders a component with one conditional variant on two breakpoints applied', () => {
		const { styled, toString } = createCss(config)
		const component = styled('div', componentConfig)
		const componentClassName = `sx03kz9`
		const componentSmallBp1ClassName = `${componentClassName}iopr7--size-small`
		const componentLargeBp2ClassName = `${componentClassName}o7z8r--size-large`
		const componentSmallBp1CssText = `@media (max-width: 767px){.${componentSmallBp1ClassName}{font-size:16px;}}`
		const componentLargeBp2CssText = `@media (min-width: 768px){.${componentLargeBp2ClassName}{font-size:24px;}}`

		expect(component.render({ size: { bp1: 'small', bp2: 'large' } }).props.className).toBe([componentClassName, componentSmallBp1ClassName, componentLargeBp2ClassName].join(' '))
		expect(toString()).toBe([componentSmallBp1CssText, componentLargeBp2CssText].join(''))
	})

	test('Renders a component with a conditional variant repeatedly', () => {
		const { styled, toString } = createCss(config)
		const component = styled('div', componentConfig)
		const componentClassName = `sx03kz9`
		const componentSmallBp1ClassName = `${componentClassName}iopr7--size-small`
		const componentSmallBp1ClassNameB = `${componentClassName}iopr6--size-small`
		const componentLargeBp2ClassName = `${componentClassName}o7z8r--size-large`
		const componentLargeBp2ClassNameB = `${componentClassName}o7z8s--size-large`
		const componentSmallBp1CssText = `@media (max-width: 767px){.${componentSmallBp1ClassName}{font-size:16px;}}`
		const componentLargeBp2CssText = `@media (min-width: 768px){.sx03kz9o7z8r--size-large{font-size:24px;}}`

		expect(component.render({ size: { bp1: 'small', bp2: 'large' } }).props.className).toBe([componentClassName, componentSmallBp1ClassName, componentLargeBp2ClassName].join(' '))
		expect(toString()).toBe([componentSmallBp1CssText, componentLargeBp2CssText].join(''))

		expect(component.render({ size: { bp1: 'small', bp2: 'large' } }).props.className).toBe([componentClassName, componentSmallBp1ClassNameB, componentLargeBp2ClassNameB].join(' '))
		expect(toString()).toBe(
			`@media (max-width: 767px){.sx03kz9iopr7--size-small{font-size:16px;}}@media (min-width: 768px){.sx03kz9o7z8r--size-large{font-size:24px;}}@media (max-width: 767px){.sx03kz9iopr6--size-small{font-size:16px;}}@media (min-width: 768px){.sx03kz9o7z8s--size-large{font-size:24px;}}`,
		)

		expect(component.render({ size: { bp1: 'small', bp2: 'large' } }).props.className).toBe(`sx03kz9 sx03kz9ioprx--size-small sx03kz9o7z8l--size-large`)
		expect(toString()).toBe(
			`@media (max-width: 767px){.sx03kz9iopr7--size-small{font-size:16px;}}@media (min-width: 768px){.sx03kz9o7z8r--size-large{font-size:24px;}}@media (max-width: 767px){.sx03kz9iopr6--size-small{font-size:16px;}}@media (min-width: 768px){.sx03kz9o7z8s--size-large{font-size:24px;}}@media (max-width: 767px){.sx03kz9ioprx--size-small{font-size:16px;}}@media (min-width: 768px){.sx03kz9o7z8l--size-large{font-size:24px;}}`,
		)
	})
})
