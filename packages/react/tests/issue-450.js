import * as React from 'react'
import * as renderer from 'react-test-renderer'
import createCss from '../src/index.js'

describe('Issue #416', () => {
	test('Compound variants apply to composed components', () => {
		const { styled } = createCss()

		const Tile = styled('div', {
			'--tile': 1,
			variants: {
				appearance: {
					primary: {},
					secondary: {
						'--appearance-secondary': 1,
					},
				},
				color: {
					red: {},
					purple: {
						'--color-purple': 1,
					},
					lightBlue: {
						'--color-lightblue': 1,
					},
				},
			},
			compoundVariants: [
				{
					appearance: 'secondary',
					color: 'lightBlue',
					css: {
						'--compound-appearance_secondary-color_lightblue': 1,
					},
				},
			],
			defaultVariants: {
				appearance: 'primary',
				color: 'red',
			},
		})

		const RoundedTile = styled(Tile, {
			'--rounded-tile': 1,
			defaultVariants: {
				appearance: 'secondary',
				color: 'lightBlue',
			},
		})

		let RenderOf = (...args) => {
			let Rendered

			void renderer.act(() => {
				Rendered = renderer.create(React.createElement(...args))
			})

			return Rendered.toJSON()
		}

		const classOfAppearancePrimary = 'sx7vw5z03kz9--appearance-primary'
		const classOfAppearanceSecondary = 'sx7vw5z8kgjb--appearance-secondary'
		const classOfColorLightBlue = 'sx7vw5z2xt05--color-lightBlue'
		const classOfColorRed = `sx7vw5z03kz8--color-red`
		const classOfCompound = 'sx7vw5zt2yhf--c2'

		/* Normal variants */
		// appearance: primary, color: red
		expect(RenderOf(Tile, null, 'Red').props.className).toBe(`sxkpryy sxkpryy03kze--appearance-primary sxkpryy03kze--color-red`)
		// appearance: primary, color: lightblue
		expect(RenderOf(Tile, { color: 'lightBlue' }, 'Blue').props.className).toBe(`sxkpryy sxkpryy03kze--appearance-primary sxkpryy2xt05--color-lightBlue`)

		/* Compound variants */
		// appearance: primary, color: lightblue
		expect(RenderOf(Tile, { appearance: 'secondary' }, 'Red').props.className).toBe(`sxkpryy sxkpryy8kgjb--appearance-secondary sxkpryy03kze--color-red`)
		// appearance: secondary, compound*2
		expect(RenderOf(Tile, { appearance: 'secondary', color: 'lightBlue' }, 'Red').props.className).toBe(`sxkpryy sxkpryy8kgjb--appearance-secondary sxkpryy2xt05--color-lightBlue sxkpryyt2yhf--c2`)

		/* ❌ Restyled compound variants (default) */
		// appearance: primary, color: red, +
		expect(RenderOf(RoundedTile, null, 'Blue').props.className).toBe(`sxkpryy sxkpryy8kgjb--appearance-secondary sxkpryy2xt05--color-lightBlue sxkpryyt2yhf--c2 sxhgh1l`)

		/* ❌ Restyled compound variants (explicit) */
		// appearance: secondary, compound * 2, +
		expect(RenderOf(RoundedTile, { appearance: 'secondary', color: 'lightBlue' }, 'Blue').props.className).toBe(`sxkpryy sxkpryy8kgjb--appearance-secondary sxkpryy2xt05--color-lightBlue sxkpryyt2yhf--c2 sxhgh1l`)
	})
})
