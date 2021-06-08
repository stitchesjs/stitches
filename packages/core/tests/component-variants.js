import { createCss } from '../src/index.js'

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
		const { css, getCssString } = createCss()
		const component = css(componentConfig)
		const expression = component()

		expect(expression.className).toBe('c-PJLV')
		expect(getCssString()).toBe('')
	})

	test('Renders a component with 1 matching variant', () => {
		const { css, getCssString } = createCss()
		const component = css(componentConfig)
		const expression1 = component({ size: 'small' })

		const expression1CssText = '.c-PJLV-Gaggi-sv{font-size:16px}'

		expect(expression1.className).toBe('c-PJLV c-PJLV-Gaggi-sv')
		expect(getCssString()).toBe(`--stitches{--:3 c-PJLV-Gaggi-sv}@media{${expression1CssText}}`)

		const expression2 = component({ color: 'blue' })

		const expression2CssText = '.c-PJLV-kaCQqN-sv{background-color:dodgerblue;color:white}'

		expect(expression2.className).toBe('c-PJLV c-PJLV-kaCQqN-sv')
		expect(getCssString()).toBe(`--stitches{--:3 c-PJLV-Gaggi-sv c-PJLV-kaCQqN-sv}@media{${expression1CssText + expression2CssText}}`)
	})

	test('Renders a component with 2 matching variants', () => {
		const { css, getCssString } = createCss()
		const component = css({
			variants: {
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
			}
		})
		const expression = component({ size: 'small', level: 1 })

		expect(expression.className).toBe('c-PJLV c-PJLV-Gaggi-sv c-PJLV-iRwLiB-sv')

		const expressionSizeSmallCssText = '.c-PJLV-Gaggi-sv{font-size:16px}'
		const expressionLevel1CssText = '.c-PJLV-iRwLiB-sv{padding:0.5em}'

		expect(getCssString()).toBe(`--stitches{--:3 c-PJLV-Gaggi-sv c-PJLV-iRwLiB-sv}@media{${expressionSizeSmallCssText + expressionLevel1CssText}}`)
	})

	test('Renders a component with a 2 matching variants and 1 matching compound', () => {
		const { css, getCssString } = createCss()
		const component = css(componentConfig)
		const expression = component({ size: 'small', color: 'blue' })

		const expressionColorBlueCssText = '.c-PJLV-kaCQqN-sv{background-color:dodgerblue;color:white}'
		const expressionSizeSmallCssText = '.c-PJLV-Gaggi-sv{font-size:16px}'
		const expressionCompoundCssText = '.c-PJLV-cChFtv-cv{transform:scale(1.2)}'

		expect(expression.className).toBe(`c-PJLV c-PJLV-kaCQqN-sv c-PJLV-Gaggi-sv c-PJLV-cChFtv-cv`)
		expect(getCssString()).toBe(
			`--stitches{--:3 c-PJLV-kaCQqN-sv c-PJLV-Gaggi-sv}@media{${
				expressionColorBlueCssText + expressionSizeSmallCssText
			}}--stitches{--:4 c-PJLV-cChFtv-cv}@media{${
				expressionCompoundCssText
			}}`
		)
	})
}) // prettier-ignore

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
		const { css, getCssString } = createCss()
		const component = css(componentConfig)
		const expression = component()

		expect(expression.className).toBe('c-PJLV c-PJLV-Gaggi-sv')
		expect(getCssString()).toBe(`--stitches{--:3 c-PJLV-Gaggi-sv}@media{.c-PJLV-Gaggi-sv{font-size:16px}}`)
	})

	test('Renders a component with the default variant explicitly applied', () => {
		const { css, getCssString } = createCss()
		const component = css(componentConfig)
		const expression = component({ size: 'small' })

		expect(expression.className).toBe('c-PJLV c-PJLV-Gaggi-sv')
		expect(getCssString()).toBe(`--stitches{--:3 c-PJLV-Gaggi-sv}@media{.c-PJLV-Gaggi-sv{font-size:16px}}`)
	})

	test('Renders a component with the non-default variant explicitly applied', () => {
		const { css, getCssString } = createCss()
		const component = css(componentConfig)
		const expression = component({ size: 'large' })

		expect(expression.className).toBe('c-PJLV c-PJLV-hsYHIj-sv')
		expect(getCssString()).toBe(`--stitches{--:3 c-PJLV-hsYHIj-sv}@media{.c-PJLV-hsYHIj-sv{font-size:24px}}`)
	})

	test('Renders a component with the default variant applied and a different variant explicitly applied', () => {
		const { css, getCssString } = createCss()
		const component = css(componentConfig)
		const expression = component({ level: 1 })

		expect(expression.className).toBe('c-PJLV c-PJLV-Gaggi-sv c-PJLV-iRwLiB-sv')
		expect(getCssString()).toBe(
			`--stitches{--:3 c-PJLV-Gaggi-sv c-PJLV-iRwLiB-sv}@media{` +
				// implicit size:small
				`.c-PJLV-Gaggi-sv{font-size:16px}` +
				// explicit level:1
				`.c-PJLV-iRwLiB-sv{padding:0.5em}` +
				`}`,
		)
	})

	test('Renders a component with the default variant applied, a different variant explicitly applied, and a compound applied', () => {
		const { css, getCssString } = createCss()
		const component = css(componentConfig)
		const expression = component({ color: 'blue' })

		expect(expression.className).toBe('c-PJLV c-PJLV-kaCQqN-sv c-PJLV-Gaggi-sv c-PJLV-cChFtv-cv')
		expect(getCssString()).toBe(
			`--stitches{--:3 c-PJLV-kaCQqN-sv c-PJLV-Gaggi-sv}@media{` +
				// explicit color:blue
				`.c-PJLV-kaCQqN-sv{background-color:dodgerblue;color:white}` +
				// implicit size:small
				`.c-PJLV-Gaggi-sv{font-size:16px}` +
			`}--stitches{--:4 c-PJLV-cChFtv-cv}@media{` +
				// compound color:blue + size:small
				`.c-PJLV-cChFtv-cv{transform:scale(1.2)}` +
			`}`,
		)
	})

	test('Returns a component class without the default variant applied when stringified', () => {
		const { css, getCssString } = createCss()
		const component = css(componentConfig)
		const className = `${component}`

		expect(className).toBe('c-PJLV')
		expect(getCssString()).toBe('--stitches{--:3 c-PJLV-Gaggi-sv}@media{.c-PJLV-Gaggi-sv{font-size:16px}}')
	})
}) // prettier-ignore

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
		const { css, getCssString } = createCss(config)
		const component = css(componentConfig)
		const componentClassName = 'c-PJLV'

		expect(component().className).toBe(componentClassName)
		expect(getCssString()).toBe('')
	})

	test('Renders a component with one variant applied', () => {
		const { css, getCssString } = createCss(config)
		const component = css(componentConfig)
		const componentClassName = `c-PJLV`
		const componentSmallClassName = `${componentClassName}-Gaggi-sv`
		const componentSmallCssText = `.${componentSmallClassName}{font-size:16px}`

		expect(component({ size: 'small' }).className).toBe([componentClassName, componentSmallClassName].join(' '))
		expect(getCssString()).toBe(`--stitches{--:3 c-PJLV-Gaggi-sv}@media{${componentSmallCssText}}`)
	})

	test('Renders a component with one conditional variant on one breakpoint applied', () => {
		const { css, getCssString } = createCss(config)
		const component = css(componentConfig)

		expect(component({ size: { '@bp1': 'small' } }).className).toBe(`c-PJLV c-PJLV-iVKIeV-sv`)
		expect(getCssString()).toBe(
			`--stitches{--:3 c-PJLV-iVKIeV-sv}@media{` +
				`@media (max-width: 767px){.c-PJLV-iVKIeV-sv{font-size:16px}}` +
			`}`
		)
	})

	test('Renders a component with one conditional variant on two breakpoints applied', () => {
		const { css, getCssString } = createCss(config)
		const component = css(componentConfig)
		const componentClassName = `c-PJLV`
		const componentSmallBp1ClassName = `${componentClassName}-iVKIeV-sv`
		const componentLargeBp2ClassName = `${componentClassName}-bUkcYv-sv`
		const componentSmallBp1CssText = `@media (max-width: 767px){.${componentSmallBp1ClassName}{font-size:16px}}`
		const componentLargeBp2CssText = `@media (min-width: 768px){.${componentLargeBp2ClassName}{font-size:24px}}`

		expect(component({ size: { '@bp1': 'small', '@bp2': 'large' } }).className).toBe([componentClassName, componentSmallBp1ClassName, componentLargeBp2ClassName].join(' '))
		expect(getCssString()).toBe(
			`--stitches{--:3 c-PJLV-iVKIeV-sv c-PJLV-bUkcYv-sv}@media{` +
				componentSmallBp1CssText +
				componentLargeBp2CssText +
			`}`
		)
	})

	test('Renders a component with a conditional variant repeatedly', () => {
		const { css, getCssString } = createCss(config)
		const component = css(componentConfig)

		expect(component({ size: { '@bp1': 'small', '@bp2': 'large' } }).className).toBe(`c-PJLV c-PJLV-iVKIeV-sv c-PJLV-bUkcYv-sv`)
		expect(getCssString()).toBe(
			`--stitches{--:3 c-PJLV-iVKIeV-sv c-PJLV-bUkcYv-sv}@media{` +
				`@media (max-width: 767px){.c-PJLV-iVKIeV-sv{font-size:16px}}` +
				`@media (min-width: 768px){.c-PJLV-bUkcYv-sv{font-size:24px}}` +
			`}`
		)

		expect(component({ size: { '@bp1': 'small', '@bp2': 'large' } }).className).toBe(`c-PJLV c-PJLV-iVKIeV-sv c-PJLV-bUkcYv-sv`)
		expect(getCssString()).toBe(
			`--stitches{--:3 c-PJLV-iVKIeV-sv c-PJLV-bUkcYv-sv}@media{` +
				`@media (max-width: 767px){.c-PJLV-iVKIeV-sv{font-size:16px}}` +
				`@media (min-width: 768px){.c-PJLV-bUkcYv-sv{font-size:24px}}` +
			`}`
		)

		expect(component({ size: { '@bp1': 'small', '@bp2': 'large' } }).className).toBe(`c-PJLV c-PJLV-iVKIeV-sv c-PJLV-bUkcYv-sv`)
		expect(getCssString()).toBe(
			`--stitches{--:3 c-PJLV-iVKIeV-sv c-PJLV-bUkcYv-sv}@media{` +
				`@media (max-width: 767px){.c-PJLV-iVKIeV-sv{font-size:16px}}` +
				`@media (min-width: 768px){.c-PJLV-bUkcYv-sv{font-size:24px}}` +
			`}`
		)
	})

	test('Renders a component with a conditional inline variant repeatedly', () => {
		{
			const { css, getCssString } = createCss(config)
			const component = css({
				variants: {
					size: {
						small: {
							fontSize: '16px',
						},
						large: {
							fontSize: '24px',
						},
					},
				},
			})

			expect(
				component({
					size: {
						'@media (width < 768px)': 'small',
						'@media (width >= 768px)': 'large',
					},
				}).className,
			).toBe('c-PJLV c-PJLV-gjWYHE-sv c-PJLV-fzmUzy-sv')

			expect(getCssString()).toBe(
				`--stitches{--:3 c-PJLV-gjWYHE-sv c-PJLV-fzmUzy-sv}@media{` +
					`@media (max-width:767.9375px){.c-PJLV-gjWYHE-sv{font-size:16px}}` +
					`@media (min-width:768px){.c-PJLV-fzmUzy-sv{font-size:24px}}` +
				`}`
			)
		}

		{
			const { css, getCssString } = createCss(config)
			const component = css({
				variants: {
					size: {
						large: {
							fontSize: '24px',
						},
						small: {
							fontSize: '16px',
						},
					},
				},
			})

			expect(
				component({
					size: {
						'@media (width < 768px)': 'small',
						'@media (width >= 768px)': 'large',
					},
				}).className,
			).toBe('c-PJLV c-PJLV-gjWYHE-sv c-PJLV-fzmUzy-sv')

			expect(getCssString()).toBe(
				`--stitches{--:3 c-PJLV-gjWYHE-sv c-PJLV-fzmUzy-sv}@media{` +
					`@media (max-width:767.9375px){.c-PJLV-gjWYHE-sv{font-size:16px}}` +
					`@media (min-width:768px){.c-PJLV-fzmUzy-sv{font-size:24px}}` +
				`}`
			)
		}
	})
}) // prettier-ignore

describe('Variant pairing types', () => {
	const componentConfigForBooleanVariant = {
		'--component': true,
		variants: {
			testBoolean: {
				true: {
					'--test-boolean': true,
				},
				false: {
					'--test-boolean': false,
				}
			}
		}
	}

	test('Renders a variant with an inactive string variant', () => {
		const { css, getCssString } = createCss()
		const component = css(componentConfigForBooleanVariant)
		const rendering = component()

		expect(rendering.className).toBe('c-foEXqW')
		expect(getCssString()).toBe(`--stitches{--:2 c-foEXqW}@media{` +
			`.c-foEXqW{--component:true}` +
		`}`)
	})

	test('Renders a variant with an active string variant', () => {
		const { css, getCssString } = createCss()
		const component = css(componentConfigForBooleanVariant)
		const rendering = component({ testBoolean: 'true' })

		expect(rendering.className).toBe('c-foEXqW c-foEXqW-iloXEi-sv')
		expect(getCssString()).toBe(
			`--stitches{--:2 c-foEXqW}@media{` +
				`.c-foEXqW{--component:true}` +
			`}` +
			`--stitches{--:3 c-foEXqW-iloXEi-sv}@media{` +
				`.c-foEXqW-iloXEi-sv{--test-boolean:true}` +
			`}`
		)
	})

	test('Renders a variant with an active boolean variant', () => {
		const { css, getCssString } = createCss()
		const component = css(componentConfigForBooleanVariant)
		const rendering = component({ testBoolean: true })

		expect(rendering.className).toBe('c-foEXqW c-foEXqW-iloXEi-sv')
		expect(getCssString()).toBe(
			`--stitches{--:2 c-foEXqW}@media{` +
				`.c-foEXqW{--component:true}` +
			`}` +
			`--stitches{--:3 c-foEXqW-iloXEi-sv}@media{` +
				`.c-foEXqW-iloXEi-sv{--test-boolean:true}` +
			`}`
		)
	})

	test('Renders a variant with an active responsive string variant', () => {
		const { css, getCssString } = createCss()
		const component = css(componentConfigForBooleanVariant)
		const rendering = component({ testBoolean: { '@media (min-width: 640px)': 'true' } })

		expect(rendering.className).toBe('c-foEXqW c-foEXqW-brOaTK-sv')
		expect(getCssString()).toBe(
			`--stitches{--:2 c-foEXqW}@media{` +
				`.c-foEXqW{--component:true}` +
			`}` +
			`--stitches{--:3 c-foEXqW-brOaTK-sv}@media{` +
				`@media (min-width: 640px){` +
					`.c-foEXqW-brOaTK-sv{--test-boolean:true}` +
				`}` +
			`}`
		)
	})

	test('Renders a variant with an active responsive boolean variant', () => {
		const { css, getCssString } = createCss()
		const component = css(componentConfigForBooleanVariant)
		const rendering = component({ testBoolean: { '@media (min-width: 640px)': true } })

		expect(rendering.className).toBe('c-foEXqW c-foEXqW-brOaTK-sv')
		expect(getCssString()).toBe(
			`--stitches{--:2 c-foEXqW}@media{` +
				`.c-foEXqW{--component:true}` +
			`}` +
			`--stitches{--:3 c-foEXqW-brOaTK-sv}@media{` +
				`@media (min-width: 640px){` +
					`.c-foEXqW-brOaTK-sv{--test-boolean:true}` +
				`}` +
			`}`
		)
	})
}) // prettier-ignore
