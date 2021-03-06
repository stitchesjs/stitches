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

		/* Normal variants */
		expect(RenderOf(Tile, null, 'Red').props.className).toBe('sx7vw5z sx7vw5z03kze--appearance-primary sx7vw5z03kze--color-red')
		expect(RenderOf(Tile, { color: 'lightBlue' }, 'Blue').props.className).toBe('sx7vw5z sx7vw5z03kze--appearance-primary sx7vw5z2xt05--color-lightBlue')

		/* Compound variants */
		expect(RenderOf(Tile, { appearance: 'secondary' }, 'Red').props.className).toBe('sx7vw5z sx7vw5z8kgjb--appearance-secondary sx7vw5z03kze--color-red')
		expect(RenderOf(Tile, { appearance: 'secondary', color: 'lightBlue' }, 'Red').props.className).toBe('sx7vw5z sx7vw5z8kgjb--appearance-secondary sx7vw5z2xt05--color-lightBlue sx7vw5zt2yhf--c2')

		/* ❌ Restyled compound variants (default) */
		expect(RenderOf(RoundedTile, null, 'Blue').props.className).toBe('sx7vw5z sx7vw5z03kze--appearance-primary sx7vw5z03kze--color-red sxrtsyk')

		/* ❌ Restyled compound variants (explicit) */
		expect(RenderOf(RoundedTile, { appearance: 'secondary', color: 'lightBlue' }, 'Blue').props.className).toBe('sx7vw5z sx7vw5z8kgjb--appearance-secondary sx7vw5z2xt05--color-lightBlue sx7vw5zt2yhf--c2 sxrtsyk')
	})
})
