import createCss from '../src/index.js'
import getHashString from '../src/getHashString.js'

describe('Composition', () => {
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

	const { variants, defaultVariants, compoundVariants, ...componentStyles } = componentConfig

  test('Inherits styles, variants, and compound variants from composer', () => {
    const { css, toString } = createCss()
		const composed = css(componentConfig)

		const extendedStyles = { borderRadius: '2px' }
    const component = css(composed, extendedStyles)
		const expression = component({ size: 'small', color: 'blue' })

		const className = getHashString('sx', componentStyles)
		const extendedClassName = getHashString('sx', extendedStyles)
		const sizeSmallClassName = `${getHashString(className, variants.size.small)}--size-small`
		const colorBlueClassName = `${getHashString(className, variants.color.blue)}--color-blue`
		const compoundSmallBlueClassName = `${getHashString(extendedClassName, compoundVariants[0].css)}--comp`

		const expressionExtendedCssText = `.${extendedClassName}{border-radius:2px;}`
		const expressionSizeSmallCssText = `.${sizeSmallClassName}{font-size:16px;}`
		const expressionColorBlueCssText = `.${colorBlueClassName}{background-color:dodgerblue;color:white;}`
		const expressionCompoundCssText = `.${compoundSmallBlueClassName}{transform:scale(1.2);}`

		expect(expression.className).toBe(`${className} ${extendedClassName} ${compoundSmallBlueClassName} ${sizeSmallClassName} ${colorBlueClassName}`)
		expect(toString()).toBe(expressionSizeSmallCssText + expressionColorBlueCssText + expressionExtendedCssText + expressionCompoundCssText)
  })

	test('Extends and overrides variants from composer', () => {
		const { css, toString } = createCss()
		const composed = css(componentConfig)

		const extendedStyles = {
			variants: {
				size: {
					small: {
						fontSize: '14px'
					}
				},
				level: {
					3: {
						padding: '2em'
					}
				}
			}
		}
    const component = css(composed, extendedStyles)
		const expression = component({ size: 'small', color: 'red', level: 3 })

		const className = getHashString('sx', componentStyles)
		const sizeSmallClassName = `${getHashString(className, variants.size.small)}--size-small`
		const colorRedClassName = `${getHashString(className, variants.color.red)}--color-red`

		const overrideSizeSmallClassName = `${getHashString(className, extendedStyles.variants.size.small)}--size-small`
		const level3ClassName = `${getHashString(className, extendedStyles.variants.level[3])}--level-3`

		const expressionSizeSmallCssText = `.${sizeSmallClassName}{font-size:16px;}`
		const expressionColorRedCssText = `.${colorRedClassName}{background-color:tomato;color:white;}`

		const expressionExtendedSizeSmallCssText = `.${overrideSizeSmallClassName}{font-size:14px;}`
		const expressionLevel3CssText = `.${level3ClassName}{padding:2em;}`

		expect(expression.className).toBe(`${className} ${sizeSmallClassName} ${overrideSizeSmallClassName} ${colorRedClassName} ${level3ClassName}`)
		expect(toString()).toBe(expressionSizeSmallCssText + expressionColorRedCssText + expressionExtendedSizeSmallCssText + expressionLevel3CssText)
	})

	test('Extends and overrides compound variants from composer', () => {
		const { css, toString } = createCss()
		const composed = css(componentConfig)

		const extendedStyles = {
			compoundVariants: [{
				color: 'blue',
				size: 'small',
				css: {
					transform: 'scale(2)'
				}
			}, {
				size: 'small',
				level: 2,
				css: {
					borderRadius: '2px'
				}
			}]
		}
    const component = css(composed, extendedStyles)
		const expression = component({ size: 'small', color: 'blue', level: 2 })

		const className = getHashString('sx', componentStyles)
		const sizeSmallClassName = `${getHashString(className, variants.size.small)}--size-small`
		const colorBlueClassName = `${getHashString(className, variants.color.blue)}--color-blue`
		const level2ClassName = `${getHashString(className, variants.level[2])}--level-2`

		const overrideCompoundSmallBlueClassName = `${getHashString(className, extendedStyles.compoundVariants[0].css)}--comp`
		const compoundSmallLevel2ClassName = `${getHashString(className, extendedStyles.compoundVariants[1].css)}--comp`

		const expressionSizeSmallCssText = `.${sizeSmallClassName}{font-size:16px;}`
		const expressionColorBlueCssText = `.${colorBlueClassName}{background-color:dodgerblue;color:white;}`
		const expressionLevel2CssText = `.${level2ClassName}{padding:1em;}`

		const expressionOverrideCompoundCssText = `.${overrideCompoundSmallBlueClassName}{transform:scale(2);}`
		const expressionExtendedCompoundCssText = `.${compoundSmallLevel2ClassName}{border-radius:2px;}`

		expect(expression.className).toBe(`${className} ${overrideCompoundSmallBlueClassName} ${compoundSmallLevel2ClassName} ${sizeSmallClassName} ${colorBlueClassName} ${level2ClassName}`)
		expect(toString()).toBe(expressionSizeSmallCssText + expressionColorBlueCssText + expressionLevel2CssText + expressionOverrideCompoundCssText + expressionExtendedCompoundCssText)
	})
})
