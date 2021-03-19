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

		expect(expression.props.className).toBe('sx1alao')
		expect(toString()).toBe('')
	})

	test('Renders a component with 1 matching variant', () => {
		const { styled, toString } = createCss()
		const component = styled('div', componentConfig)
		const expression1 = component.render({ size: 'small' })

		const expression1CssText = '.sx1alaotmy8g--size-small{font-size:16px;}'

		expect(expression1.props.className).toBe('sx1alao sx1alaotmy8g--size-small')
		expect(toString()).toBe(expression1CssText)

		const expression2 = component.render({ color: 'blue' })

		const expression2CssText = '.sx1alao4wpam--color-blue{background-color:dodgerblue;color:white;}'

		expect(expression2.props.className).toBe('sx1alao sx1alao4wpam--color-blue')
		expect(toString()).toBe(expression1CssText + expression2CssText)
	})

	test('Renders a component with 2 matching variants', () => {
		const { styled, toString } = createCss()
		const component = styled('div', componentConfig)
		const expression = component.render({ size: 'small', level: 1 })

		expect(expression.props.className).toBe('sx1alao sx1alaotmy8g--size-small sx1alaohmqox--level-1')

		const expressionSizeSmallCssText = '.sx1alaotmy8g--size-small{font-size:16px;}'
		const expressionLevel1CssText = '.sx1alaohmqox--level-1{padding:0.5em;}'

		expect(toString()).toBe(expressionSizeSmallCssText + expressionLevel1CssText)
	})

	test('Renders a component with a 2 matching variants and 1 matching compound', () => {
		const { styled, toString } = createCss()
		const component = styled('div', componentConfig)
		const expression = component.render({ size: 'small', color: 'blue' })

		const expressionSizeSmallCssText = '.sx1alaotmy8g--size-small{font-size:16px;}'
		const expressionColorBlueCssText = '.sx1alao4wpam--color-blue{background-color:dodgerblue;color:white;}'
		const expressionCompoundCssText = '.sx1alaoif1wl--c2{transform:scale(1.2);}'

		expect(expression.props.className).toBe('sx1alao sx1alao4wpam--color-blue sx1alaotmy8g--size-small sx1alaoif1wl--c2')
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

		expect(expression.props.className).toBe('sx84yep sx84yeptmy8g--size-small')
		expect(toString()).toBe('.sx84yeptmy8g--size-small{font-size:16px;}')
	})

	test('Renders a component with the default variant explicitly applied', () => {
		const { styled, toString } = createCss()
		const component = styled('div', componentConfig)
		const expression = component.render({ size: 'small' })

		expect(expression.props.className).toBe('sx84yep sx84yeptmy8g--size-small')
		expect(toString()).toBe('.sx84yeptmy8g--size-small{font-size:16px;}')
	})

	test('Renders a component with the non-default variant explicitly applied', () => {
		const { styled, toString } = createCss()
		const component = styled('div', componentConfig)
		const expression = component.render({ size: 'large' })

		expect(expression.props.className).toBe('sx84yep sx84yepfhyhx--size-large')
		expect(toString()).toBe('.sx84yepfhyhx--size-large{font-size:24px;}')
	})

	test('Renders a component with the default variant applied and a different variant explicitly applied', () => {
		const { styled, toString } = createCss()
		const component = styled('div', componentConfig)
		const expression = component.render({ level: 1 })

		expect(expression.props.className).toBe('sx84yep sx84yeptmy8g--size-small sx84yephmqox--level-1')
		expect(toString()).toBe(
			[
				// implicit size:small
				'.sx84yeptmy8g--size-small{font-size:16px;}',
				// explicit level:1
				'.sx84yephmqox--level-1{padding:0.5em;}',
			].join(''),
		)
	})

	test('Renders a component with the default variant applied, a different variant explicitly applied, and a compound applied', () => {
		const { styled, toString } = createCss()
		const component = styled('div', componentConfig)
		const expression = component.render({ color: 'blue' })

		expect(expression.props.className).toBe('sx84yep sx84yep4wpam--color-blue sx84yeptmy8g--size-small sx84yepif1wl--c2')
		expect(toString()).toBe(
			[
				// explicit color:blue
				'.sx84yep4wpam--color-blue{background-color:dodgerblue;color:white;}',
				// implicit size:small
				'.sx84yeptmy8g--size-small{font-size:16px;}',
				// compound color:blue + size:small
				'.sx84yepif1wl--c2{transform:scale(1.2);}',
			].join(''),
		)
	})

	test('Returns a component selector without the default variant applied when toString is used', () => {
		const { styled, toString } = createCss()
		const component = styled('div', componentConfig)
		const selector = component.toString()

		expect(selector).toBe('.sx84yep')
		expect(toString()).toBe('')
	})
})

describe('Conditional variants', () => {
	const config = {
		media: {
			bp1: '(max-width: 767px)',
			bp2: '(min-width: 768px)',
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
		const componentClassName = 'sx1alao'

		expect(component.render().props.className).toBe(componentClassName)
		expect(toString()).toBe('')
	})

	test('Renders a component with one variant applied', () => {
		const { styled, toString } = createCss(config)
		const component = styled('div', componentConfig)
		const componentClassName = `sx1alao`
		const componentSmallClassName = `${componentClassName}tmy8g--size-small`
		const componentSmallCssText = `.${componentSmallClassName}{font-size:16px;}`

		expect(component.render({ size: 'small' }).props.className).toBe([componentClassName, componentSmallClassName].join(' '))
		expect(toString()).toBe(componentSmallCssText)
	})

	test('Renders a component with one conditional variant on one breakpoint applied', () => {
		const { styled, toString } = createCss(config)
		const component = styled('div', componentConfig)
		const componentClassName = `sx1alao`
		const componentSmallBp1ClassName = `${componentClassName}y0yjf--size-small`
		const componentSmallBp1CssText = `@media (max-width: 767px){.${componentSmallBp1ClassName}{font-size:16px;}}`

		expect(component.render({ size: { '@bp1': 'small' } }).props.className).toBe([componentClassName, componentSmallBp1ClassName].join(' '))
		expect(toString()).toBe(componentSmallBp1CssText)
	})

	test('Renders a component with one conditional variant on two breakpoints applied', () => {
		const { styled, toString } = createCss(config)
		const component = styled('div', componentConfig)
		const componentClassName = `sx1alao`
		const componentSmallBp1ClassName = `${componentClassName}y0yjf--size-small`
		const componentLargeBp2ClassName = `${componentClassName}1jf5y--size-large`
		const componentSmallBp1CssText = `@media (max-width: 767px){.${componentSmallBp1ClassName}{font-size:16px;}}`
		const componentLargeBp2CssText = `@media (min-width: 768px){.${componentLargeBp2ClassName}{font-size:24px;}}`

		expect(component.render({ size: { '@bp1': 'small', '@bp2': 'large' } }).props.className).toBe([componentClassName, componentSmallBp1ClassName, componentLargeBp2ClassName].join(' '))
		expect(toString()).toBe([componentSmallBp1CssText, componentLargeBp2CssText].join(''))
	})

	test('Renders a component with a conditional variant repeatedly', () => {
		const { styled, toString } = createCss(config)
		const component = styled('div', componentConfig)
		const componentClassName = `sx1alao`
		const componentSmallBp1ClassName = `${componentClassName}y0yjf--size-small`
		const componentLargeBp2ClassName = `${componentClassName}1jf5y--size-large`
		const componentSmallBp1CssText = `@media (max-width: 767px){.${componentSmallBp1ClassName}{font-size:16px;}}`
		const componentLargeBp2CssText = `@media (min-width: 768px){.sx1alao1jf5y--size-large{font-size:24px;}}`

		expect(component.render({ size: { '@bp1': 'small', '@bp2': 'large' } }).props.className).toBe([componentClassName, componentSmallBp1ClassName, componentLargeBp2ClassName].join(' '))
		expect(toString()).toBe([componentSmallBp1CssText, componentLargeBp2CssText].join(''))

		expect(component.render({ size: { '@bp1': 'small', '@bp2': 'large' } }).props.className).toBe([componentClassName, componentSmallBp1ClassName, componentLargeBp2ClassName].join(' '))
		expect(toString()).toBe(`@media (max-width: 767px){.sx1alaoy0yjf--size-small{font-size:16px;}}@media (min-width: 768px){.sx1alao1jf5y--size-large{font-size:24px;}}`)

		expect(component.render({ size: { '@bp1': 'small', '@bp2': 'large' } }).props.className).toBe(`sx1alao sx1alaoy0yjf--size-small sx1alao1jf5y--size-large`)
		expect(toString()).toBe(`@media (max-width: 767px){.sx1alaoy0yjf--size-small{font-size:16px;}}@media (min-width: 768px){.sx1alao1jf5y--size-large{font-size:24px;}}`)
	})
})
