import { createCss } from '../src/index.js'

describe('Issue #492', () => {
	test('Conditionally apply default variants as the @initial value', () => {
		const { css, getCssString } = createCss()

		const component = css({
			variants: {
				sweet: {
					caroline: {
						'--sweet-caroline': true,
					},
					dreams: {
						'--sweet-dreams': true,
					},
				},
			},

			defaultVariants: {
				sweet: 'caroline',
			},
		})

		const componentClassName = `c-PJLV`
		const variantSweetCarolineClassName = `c-PJLV-bVaDOZ-variant`
		const variantSweetDreamsClassName = `c-PJLV-loBWDA-variant`
		const variantResponsiveSweetCarolineClassName = `c-PJLV-iuHgfx-variant`
		const variantResponsiveSweetDreamsClassName = `c-PJLV-cNdtIU-variant`

		/** Rendering of the component as-is. */
		const rendering1 = component()

		expect(
			rendering1.className
		).toBe(
			`${componentClassName} ${variantSweetCarolineClassName}`
		)

		expect(
			getCssString()
		).toBe(
			`--stitches{--:3 ${variantSweetCarolineClassName}}@media{` +
				`.${variantSweetCarolineClassName}{--sweet-caroline:true}` +
			`}`
		)

		/** Rendering of the component as-is. */
		const rendering2 = component({
			sweet: {
				'@media (min-width: 640px)': 'dreams',
			},
		})

		expect(
			rendering2.className
		).toBe(
			`${componentClassName} ${variantSweetCarolineClassName} ${variantResponsiveSweetDreamsClassName}`
		)

		expect(
			getCssString()
		).toBe(
			`--stitches{--:3 ${variantSweetCarolineClassName} ${variantResponsiveSweetDreamsClassName}}@media{` +
				`.${variantSweetCarolineClassName}{--sweet-caroline:true}` +
				`@media (min-width: 640px){.${variantResponsiveSweetDreamsClassName}{--sweet-dreams:true}}` +
			`}`
		)

		/** Rendering of the component as-is. */
		const rendering3 = component({
			sweet: {
				'@media (min-width: 640px)': 'caroline',
				'@initial': 'dreams',
			},
		})

		expect(
			rendering3.className
		).toBe(
			`${componentClassName} ${variantSweetDreamsClassName} ${variantResponsiveSweetCarolineClassName}`
		)

		expect(
			getCssString()
		).toBe(
			`--stitches{--:3 ${variantSweetCarolineClassName} ${variantResponsiveSweetDreamsClassName} ${variantSweetDreamsClassName} ${variantResponsiveSweetCarolineClassName}}@media{` +
				// last rendering
				`.${variantSweetCarolineClassName}{--sweet-caroline:true}` +
				`@media (min-width: 640px){.${variantResponsiveSweetDreamsClassName}{--sweet-dreams:true}}` +
				// this rendering
				`.${variantSweetDreamsClassName}{--sweet-dreams:true}` +
				`@media (min-width: 640px){.${variantResponsiveSweetCarolineClassName}{--sweet-caroline:true}}` +
			`}`
		)
	})

	test('Apply apply @initial styles first', () => {
		const { css, getCssString } = createCss()

		const component = css({
			'--rock': true,
			variants: {
				heavy: {
					'iron-butterfly': {
						'--weight-iron-butterfly': true,
					},
					'led-zeppelin': {
						'--weight-led-zeppelin': true,
					},
				},
			},
		})

		/** Rendering of the component as-is. */
		const rendering1 = component({
			heavy: {
				'@media (min-width: 640px)': 'led-zeppelin',
				'@initial': 'iron-butterfly',
			},
		})

		const componentClassName = `c-evVBJo`
		const variantInitialHeavyIronButterfly = `c-evVBJo-kiVNrc-variant`
		const variantMinWidth640LedZeppelin = `c-evVBJo-lgYcvN-variant`

		expect(
			rendering1.className
		).toBe(
			`${componentClassName} ${variantInitialHeavyIronButterfly} ${variantMinWidth640LedZeppelin}`
		)

		expect(
			getCssString()
		).toBe(
			`--stitches{--:2 ${componentClassName}}@media{` +
				`.${componentClassName}{--rock:true}` +
			`}` +
			`--stitches{--:3 ${variantInitialHeavyIronButterfly} ${variantMinWidth640LedZeppelin}}@media{` +
				`.${variantInitialHeavyIronButterfly}{--weight-iron-butterfly:true}` +
				`@media (min-width: 640px){.${variantMinWidth640LedZeppelin}{--weight-led-zeppelin:true}}` +
			`}`
		)
	})
}) // prettier-ignore
