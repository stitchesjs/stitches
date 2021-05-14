import { createCss } from '../src/index.js'

describe('Issue #450', () => {
	test('Basic Tests', () => {
		const getFreshComponents = () => {
			const { css, getCssString } = createCss()

			const component1 = css({
				variants: {
					color: {
						red: {
							color: 'red',
						},
						blue: {
							color: 'blue',
						},
					},
				},
				defaultVariants: {
					color: 'red',
				},
			});

			const component2 = css(component1, {
				variants: {
					color: {
						orange: {
							color: 'orange',
						},
					},
				},

				defaultVariants: {
					color: 'orange',
				},
			});

			const component3 = css(component2, {
				variants: {
					color: {
						purple: {
							color: 'rebeccapurple',
						},
					},
				},

				defaultVariants: {
					color: 'purple',
				},
			})

			return { component1, component2, component3, getCssString }
		}

		test('Render component1() as red, inherited from defaultVariants', () => {
			const { component1, getCssString } = getFreshComponents()
			const render = component1()
			expect(render.className).toBe(`c-PJLV c-PJLV-gmqXFB-variant`)
			expect(getCssString()).toBe(`--stitches{--:3 c-PJLV-gmqXFB-variant}@media{.c-PJLV-gmqXFB-variant{color:red}}`)
		})

		test('Render component1({ color: "blue" }) as blue, assigned from props', () => {
			const { component1, getCssString } = getFreshComponents()
			const render = component1({ color: 'blue' })
			expect(render.className).toBe(`c-PJLV c-PJLV-kydkiA-variant`)
			expect(getCssString()).toBe(`--stitches{--:3 c-PJLV-kydkiA-variant}@media{.c-PJLV-kydkiA-variant{color:blue}}`)
		})

		test('Render component1({ color: "red" }) as red, assigned from props', () => {
			const { component1, getCssString } = getFreshComponents()
			const render = component1({ color: 'red' })
			expect(render.className).toBe(`c-PJLV c-PJLV-gmqXFB-variant`)
			expect(getCssString()).toBe(`--stitches{--:3 c-PJLV-gmqXFB-variant}@media{.c-PJLV-gmqXFB-variant{color:red}}`)
		})

		test('Render component1({ color: { "@media (width >= 640px)": "blue" } }) as red then blue, inherited from defaultVariants, assigned from props', () => {
			const { component1, getCssString } = getFreshComponents()
			const render = component1({ color: { '@media (min-width: 640px)': 'blue' } })
			expect(render.className).toBe(`c-PJLV c-PJLV-gmqXFB-variant c-PJLV-bBevdw-variant`)
			expect(getCssString()).toBe(`--stitches{--:3 c-PJLV-gmqXFB-variant c-PJLV-bBevdw-variant}@media{.c-PJLV-gmqXFB-variant{color:red}@media (min-width: 640px){.c-PJLV-bBevdw-variant{color:blue}}}`)
		})

		test('Render component2() as orange, inherited from defaultVariants', () => {
			const { component2, getCssString } = getFreshComponents()
			const render = component2()

			expect(render.className).toBe(`c-PJLV c-PJLV-vMTTG-variant`)
			expect(getCssString()).toBe(`--stitches{--:3 c-PJLV-vMTTG-variant}@media{.c-PJLV-vMTTG-variant{color:orange}}`)
		})

		test('Render component2({ color: { "@media (width >= 640px)": "blue" } }) as orange then blue, inherited from defaultVariants, assigned from props', () => {
			const { component2, getCssString } = getFreshComponents()
			const render = component2({ color: { '@media (min-width: 640px)': 'blue' } })
			expect(render.className).toBe(`c-PJLV c-PJLV-bBevdw-variant c-PJLV-vMTTG-variant`)
			expect(getCssString()).toBe(
				`--stitches{--:3 c-PJLV-bBevdw-variant c-PJLV-vMTTG-variant}@media{` +
					`@media (min-width: 640px){.c-PJLV-bBevdw-variant{color:blue}}` +
					`.c-PJLV-vMTTG-variant{color:orange}` +
				`}`
			)
		})
	})

	test('Basic Tests ported from the React version', () => {
		const getFreshComponents = () => {
			const { css, getCssString } = createCss()

			const component1 = css({
				'--component': 1,

				variants: {
					appearance: {
						primary: {},
						secondary: { '--appearance': 'secondary' },
					},
					color: {
						red: {},
						purple: { '--color': 'purple' },
						lightBlue: { '--color': 'lightBlue' },
					},
				},

				compoundVariants: [
					{
						appearance: 'secondary',
						color: 'lightBlue',
						css: {
							'--compound': 'appearance secondary / color lightBlue',
						},
					},
				],

				defaultVariants: {
					appearance: 'primary',
					color: 'red',
				},
			})

			const component2 = css(component1, {
				'--component': 2,

				'defaultVariants': {
					appearance: 'secondary',
					color: 'lightBlue',
				},
			})

			return { component1, component2, getCssString }
		}

		test('Render component1()', () => {
			const { component1, getCssString } = getFreshComponents()
			const render = component1()
			expect(render.className).toBe(`c-jyxqjt`)
			expect(getCssString()).toBe(`--stitches{--:2 c-jyxqjt}@media{.c-jyxqjt{--component:1}}`)
		})

		test('Render component1({ color: "lightBlue" })', () => {
			const { component1, getCssString } = getFreshComponents()
			const render = component1({ color: 'lightBlue' })
			expect(render.className).toBe(`c-jyxqjt c-jyxqjt-ilDyRi-variant`)
			expect(getCssString()).toBe(
				`--stitches{--:2 c-jyxqjt}@media{` +
					`.c-jyxqjt{--component:1}` +
				`}` +
				`--stitches{--:3 c-jyxqjt-ilDyRi-variant}@media{` +
					`.c-jyxqjt-ilDyRi-variant{--color:lightBlue}` +
				`}`
			)
		})

		test('Render component1({ appearance: "secondary" })', () => {
			const { component1, getCssString } = getFreshComponents()
			const render = component1({ appearance: 'secondary' })
			expect(render.className).toBe(`c-jyxqjt c-jyxqjt-cOChOn-variant`)
			expect(getCssString()).toBe(
				`--stitches{--:2 c-jyxqjt}@media{` +
					`.c-jyxqjt{--component:1}` +
				`}` +
				`--stitches{--:3 c-jyxqjt-cOChOn-variant}@media{` +
					`.c-jyxqjt-cOChOn-variant{--appearance:secondary}` +
				`}`
			)
		})

		test('Render component1({ appearance: "secondary", color: "lightBlue" })', () => {
			const { component1, getCssString } = getFreshComponents()
			const render = component1({ appearance: 'secondary', color: 'lightBlue' })
			expect(render.className).toBe(`c-jyxqjt c-jyxqjt-cOChOn-variant c-jyxqjt-ilDyRi-variant c-jyxqjt-gYqlvA-variant`)
			expect(getCssString()).toBe(
				`--stitches{--:2 c-jyxqjt}@media{` +
					`.c-jyxqjt{--component:1}` +
				`}` +
				`--stitches{--:3 c-jyxqjt-cOChOn-variant c-jyxqjt-ilDyRi-variant c-jyxqjt-gYqlvA-variant}@media{` +
					`.c-jyxqjt-cOChOn-variant{--appearance:secondary}` +
					`.c-jyxqjt-ilDyRi-variant{--color:lightBlue}` +
					`.c-jyxqjt-gYqlvA-variant{--compound:appearance secondary / color lightBlue}` +
				`}`
			)
		})

		test('Render component2()', () => {
			const { component2, getCssString } = getFreshComponents()
			const render = component2()
			expect(render.className).toBe(`c-jyxqjt c-jyxqjt-cOChOn-variant c-jyxqjt-ilDyRi-variant c-jyxqjt-gYqlvA-variant c-dkRcuu`)
			expect(getCssString()).toBe(
				`--stitches{--:2 c-jyxqjt c-dkRcuu}@media{` +
					`.c-jyxqjt{--component:1}` +
					`.c-dkRcuu{--component:2}` +
				`}` +
				`--stitches{--:3 c-jyxqjt-cOChOn-variant c-jyxqjt-ilDyRi-variant c-jyxqjt-gYqlvA-variant}@media{` +
					`.c-jyxqjt-cOChOn-variant{--appearance:secondary}` +
					`.c-jyxqjt-ilDyRi-variant{--color:lightBlue}` +
					`.c-jyxqjt-gYqlvA-variant{--compound:appearance secondary / color lightBlue}` +
				`}`
			)
		})

		test('Render component2({ appearance: "secondary", color: "lightBlue" })', () => {
			const { component2, getCssString } = getFreshComponents()
			const render = component2({ appearance: 'secondary', color: 'lightBlue' })
			expect(render.className).toBe(`c-jyxqjt c-jyxqjt-cOChOn-variant c-jyxqjt-ilDyRi-variant c-jyxqjt-gYqlvA-variant c-dkRcuu`)
			expect(getCssString()).toBe(
				`--stitches{--:2 c-jyxqjt c-dkRcuu}@media{` +
					`.c-jyxqjt{--component:1}` +
					`.c-dkRcuu{--component:2}` +
				`}` +
				`--stitches{--:3 c-jyxqjt-cOChOn-variant c-jyxqjt-ilDyRi-variant c-jyxqjt-gYqlvA-variant}@media{` +
					`.c-jyxqjt-cOChOn-variant{--appearance:secondary}` +
					`.c-jyxqjt-ilDyRi-variant{--color:lightBlue}` +
					`.c-jyxqjt-gYqlvA-variant{--compound:appearance secondary / color lightBlue}` +
				`}`
			)
		})
	})
}) // prettier-ignore
