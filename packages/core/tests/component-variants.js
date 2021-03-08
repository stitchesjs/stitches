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
		const { css, toString } = createCss()
		const component = css(componentConfig)
		const expression = component()

		expect(expression.className).toBe('sx1alao')
		expect(toString()).toBe('')
	})

	test('Renders a component with 1 matching variant', () => {
		const { css, toString } = createCss()
		const component = css(componentConfig)
		const expression1 = component({ size: 'small' })

		const expression1CssText = '.sx1alaotmy8g--size-small{font-size:16px;}'

		expect(expression1.className).toBe('sx1alao sx1alaotmy8g--size-small')
		expect(toString()).toBe(expression1CssText)

		const expression2 = component({ color: 'blue' })

		const expression2CssText = '.sx1alao4wpam--color-blue{background-color:dodgerblue;color:white;}'

		expect(expression2.className).toBe('sx1alao sx1alao4wpam--color-blue')
		expect(toString()).toBe(expression1CssText + expression2CssText)
	})

	test('Renders a component with 2 matching variants', () => {
		const { css, toString } = createCss()
		const component = css(componentConfig)
		const expression = component({ size: 'small', level: 1 })

		expect(expression.className).toBe('sx1alao sx1alaotmy8g--size-small sx1alaohmqox--level-1')

		const expressionSizeSmallCssText = '.sx1alaotmy8g--size-small{font-size:16px;}'
		const expressionLevel1CssText = '.sx1alaohmqox--level-1{padding:0.5em;}'

		expect(toString()).toBe(expressionSizeSmallCssText + expressionLevel1CssText)
	})

	test('Renders a component with a 2 matching variants and 1 matching compound', () => {
		const { css, toString } = createCss()
		const component = css(componentConfig)
		const expression = component({ size: 'small', color: 'blue' })

		const expressionColorBlueCssText = '.sx1alao4wpam--color-blue{background-color:dodgerblue;color:white;}'
		const expressionSizeSmallCssText = '.sx1alaotmy8g--size-small{font-size:16px;}'
		const expressionCompoundCssText = '.sx1alaoif1wl--c2{transform:scale(1.2);}'

		expect(expression.className).toBe('sx1alao sx1alao4wpam--color-blue sx1alaotmy8g--size-small sx1alaoif1wl--c2')
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
		const { css, toString } = createCss()
		const component = css(componentConfig)
		const expression = component()

		expect(expression.className).toBe('sx84yep sx84yeptmy8g--size-small')
		expect(toString()).toBe('.sx84yeptmy8g--size-small{font-size:16px;}')
	})

	test('Renders a component with the default variant explicitly applied', () => {
		const { css, toString } = createCss()
		const component = css(componentConfig)
		const expression = component({ size: 'small' })

		expect(expression.className).toBe('sx84yep sx84yeptmy8g--size-small')
		expect(toString()).toBe('.sx84yeptmy8g--size-small{font-size:16px;}')
	})

	test('Renders a component with the non-default variant explicitly applied', () => {
		const { css, toString } = createCss()
		const component = css(componentConfig)
		const expression = component({ size: 'large' })

		expect(expression.className).toBe('sx84yep sx84yepfhyhx--size-large')
		expect(toString()).toBe('.sx84yepfhyhx--size-large{font-size:24px;}')
	})

	test('Renders a component with the default variant applied and a different variant explicitly applied', () => {
		const { css, toString } = createCss()
		const component = css(componentConfig)
		const expression = component({ level: 1 })

		expect(expression.className).toBe('sx84yep sx84yeptmy8g--size-small sx84yephmqox--level-1')
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
		const { css, toString } = createCss()
		const component = css(componentConfig)
		const expression = component({ color: 'blue' })

		expect(expression.className).toBe('sx84yep sx84yep4wpam--color-blue sx84yeptmy8g--size-small sx84yepif1wl--c2')
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

	test('Returns a component class without the default variant applied when toString is used', () => {
		const { css, toString } = createCss()
		const component = css(componentConfig)
		const className = component.toString()

		expect(className).toBe('sx84yep')
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
		const { css, toString } = createCss(config)
		const component = css(componentConfig)
		const componentClassName = 'sx1alao'

		expect(component().className).toBe(componentClassName)
		expect(toString()).toBe('')
	})

	test('Renders a component with one variant applied', () => {
		const { css, toString } = createCss(config)
		const component = css(componentConfig)
		const componentClassName = `sx1alao`
		const componentSmallClassName = `${componentClassName}tmy8g--size-small`
		const componentSmallCssText = `.${componentSmallClassName}{font-size:16px;}`

		expect(component({ size: 'small' }).className).toBe([componentClassName, componentSmallClassName].join(' '))
		expect(toString()).toBe(componentSmallCssText)
	})

	test('Renders a component with one conditional variant on one breakpoint applied', () => {
		const { css, toString } = createCss(config)
		const component = css(componentConfig)
		const componentClassName = `sx1alao`
		const componentSmallBp1ClassName = `${componentClassName}iopr7--size-small`
		const componentSmallBp1CssText = `@media (max-width: 767px){.${componentSmallBp1ClassName}{font-size:16px;}}`

		expect(component({ size: { bp1: 'small' } }).className).toBe([componentClassName, componentSmallBp1ClassName].join(' '))
		expect(toString()).toBe(componentSmallBp1CssText)
	})

	test('Renders a component with one conditional variant on two breakpoints applied', () => {
		const { css, toString } = createCss(config)
		const component = css(componentConfig)
		const componentClassName = `sx1alao`
		const componentSmallBp1ClassName = `${componentClassName}iopr7--size-small`
		const componentLargeBp2ClassName = `${componentClassName}o7z8r--size-large`
		const componentSmallBp1CssText = `@media (max-width: 767px){.${componentSmallBp1ClassName}{font-size:16px;}}`
		const componentLargeBp2CssText = `@media (min-width: 768px){.sx1alaoo7z8r--size-large{font-size:24px;}}`

		expect(component({ size: { bp1: 'small', bp2: 'large' } }).className).toBe([componentClassName, componentSmallBp1ClassName, componentLargeBp2ClassName].join(' '))
		expect(toString()).toBe([componentSmallBp1CssText, componentLargeBp2CssText].join(''))
	})

	test('Renders a component with a conditional variant repeatedly', () => {
		const { css, toString } = createCss(config)
		const component = css(componentConfig)
		const componentClassName = `sx1alao`
		const componentSmallBp1ClassName = `${componentClassName}iopr7--size-small`
		const componentLargeBp2ClassName = `${componentClassName}o7z8r--size-large`
		const componentSmallBp1CssText = `@media (max-width: 767px){.${componentSmallBp1ClassName}{font-size:16px;}}`
		const componentLargeBp2CssText = `@media (min-width: 768px){.sx1alaoo7z8r--size-large{font-size:24px;}}`

		expect(component({ size: { bp1: 'small', bp2: 'large' } }).className).toBe([componentClassName, componentSmallBp1ClassName, componentLargeBp2ClassName].join(' '))
		expect(toString()).toBe([componentSmallBp1CssText, componentLargeBp2CssText].join(''))

		expect(component({ size: { bp1: 'small', bp2: 'large' } }).className).toBe(`sx1alao sx1alaoiopr7--size-small sx1alaoo7z8r--size-large`)
		expect(toString()).toBe(`@media (max-width: 767px){.sx1alaoiopr7--size-small{font-size:16px;}}@media (min-width: 768px){.sx1alaoo7z8r--size-large{font-size:24px;}}`)

		expect(component({ size: { bp1: 'small', bp2: 'large' } }).className).toBe([componentClassName, componentSmallBp1ClassName, componentLargeBp2ClassName].join(' '))
		expect(toString()).toBe([componentSmallBp1CssText, componentLargeBp2CssText].join(''))
	})
})
