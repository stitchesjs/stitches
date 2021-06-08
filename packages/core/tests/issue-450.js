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
			expect(render.className).toBe(`c-PJLV c-PJLV-gmqXFB-sv`)
			expect(getCssString()).toBe(`--stitches{--:3 c-PJLV-gmqXFB-sv}@media{.c-PJLV-gmqXFB-sv{color:red}}`)
		})

		test('Render component1({ color: "blue" }) as blue, assigned from props', () => {
			const { component1, getCssString } = getFreshComponents()
			const render = component1({ color: 'blue' })
			expect(render.className).toBe(`c-PJLV c-PJLV-kydkiA-sv`)
			expect(getCssString()).toBe(`--stitches{--:3 c-PJLV-kydkiA-sv}@media{.c-PJLV-kydkiA-sv{color:blue}}`)
		})

		test('Render component1({ color: "red" }) as red, assigned from props', () => {
			const { component1, getCssString } = getFreshComponents()
			const render = component1({ color: 'red' })
			expect(render.className).toBe(`c-PJLV c-PJLV-gmqXFB-sv`)
			expect(getCssString()).toBe(`--stitches{--:3 c-PJLV-gmqXFB-sv}@media{.c-PJLV-gmqXFB-sv{color:red}}`)
		})

		test('Render component1({ color: { "@media (width >= 640px)": "blue" } }) as red then blue, inherited from defaultVariants, assigned from props', () => {
			const { component1, getCssString } = getFreshComponents()
			const render = component1({ color: { '@media (min-width: 640px)': 'blue' } })
			expect(render.className).toBe(`c-PJLV c-PJLV-gmqXFB-sv c-PJLV-bBevdw-sv`)
			expect(getCssString()).toBe(`--stitches{--:3 c-PJLV-gmqXFB-sv c-PJLV-bBevdw-sv}@media{.c-PJLV-gmqXFB-sv{color:red}@media (min-width: 640px){.c-PJLV-bBevdw-sv{color:blue}}}`)
		})

		test('Render component2() as orange, inherited from defaultVariants', () => {
			const { component2, getCssString } = getFreshComponents()
			const render = component2()

			expect(render.className).toBe(`c-PJLV c-PJLV-vMTTG-sv`)
			expect(getCssString()).toBe(`--stitches{--:3 c-PJLV-vMTTG-sv}@media{.c-PJLV-vMTTG-sv{color:orange}}`)
		})

		test('Render component2({ color: { "@media (width >= 640px)": "blue" } }) as orange then blue, inherited from defaultVariants, assigned from props', () => {
			const { component2, getCssString } = getFreshComponents()
			const render = component2({ color: { '@media (min-width: 640px)': 'blue' } })
			expect(render.className).toBe(`c-PJLV c-PJLV-bBevdw-sv c-PJLV-vMTTG-sv`)
			expect(getCssString()).toBe(
				`--stitches{--:3 c-PJLV-bBevdw-sv c-PJLV-vMTTG-sv}@media{` +
					`@media (min-width: 640px){.c-PJLV-bBevdw-sv{color:blue}}` +
					`.c-PJLV-vMTTG-sv{color:orange}` +
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
			expect(render.className).toBe(`c-jyxqjt c-jyxqjt-ilDyRi-sv`)
			expect(getCssString()).toBe(
				`--stitches{--:2 c-jyxqjt}@media{` +
					`.c-jyxqjt{--component:1}` +
				`}` +
				`--stitches{--:3 c-jyxqjt-ilDyRi-sv}@media{` +
					`.c-jyxqjt-ilDyRi-sv{--color:lightBlue}` +
				`}`
			)
		})

		test('Render component1({ appearance: "secondary" })', () => {
			const { component1, getCssString } = getFreshComponents()
			const render = component1({ appearance: 'secondary' })
			expect(render.className).toBe(`c-jyxqjt c-jyxqjt-cOChOn-sv`)
			expect(getCssString()).toBe(
				`--stitches{--:2 c-jyxqjt}@media{` +
					`.c-jyxqjt{--component:1}` +
				`}` +
				`--stitches{--:3 c-jyxqjt-cOChOn-sv}@media{` +
					`.c-jyxqjt-cOChOn-sv{--appearance:secondary}` +
				`}`
			)
		})

		test('Render component1({ appearance: "secondary", color: "lightBlue" })', () => {
			const { component1, getCssString } = getFreshComponents()
			const render = component1({ appearance: 'secondary', color: 'lightBlue' })
			expect(render.className).toBe(`c-jyxqjt c-jyxqjt-cOChOn-sv c-jyxqjt-ilDyRi-sv c-jyxqjt-gYqlvA-cv`)
			expect(getCssString()).toBe(
				`--stitches{--:2 c-jyxqjt}@media{` +
					`.c-jyxqjt{--component:1}` +
				`}` +
				`--stitches{--:3 c-jyxqjt-cOChOn-sv c-jyxqjt-ilDyRi-sv}@media{` +
					`.c-jyxqjt-cOChOn-sv{--appearance:secondary}` +
					`.c-jyxqjt-ilDyRi-sv{--color:lightBlue}` +
				`}` +
				`--stitches{--:4 c-jyxqjt-gYqlvA-cv}@media{` +
					`.c-jyxqjt-gYqlvA-cv{--compound:appearance secondary / color lightBlue}` +
				`}`
			)
		})

		test('Render component2()', () => {
			const { component2, getCssString } = getFreshComponents()
			const render = component2()
			expect(render.className).toBe(`c-jyxqjt c-jyxqjt-cOChOn-sv c-jyxqjt-ilDyRi-sv c-jyxqjt-gYqlvA-cv c-dkRcuu`)
			expect(getCssString()).toBe(
				`--stitches{--:2 c-jyxqjt c-dkRcuu}@media{` +
					`.c-jyxqjt{--component:1}` +
					`.c-dkRcuu{--component:2}` +
				`}` +
				`--stitches{--:3 c-jyxqjt-cOChOn-sv c-jyxqjt-ilDyRi-sv}@media{` +
					`.c-jyxqjt-cOChOn-sv{--appearance:secondary}` +
					`.c-jyxqjt-ilDyRi-sv{--color:lightBlue}` +
				`}` +
				`--stitches{--:4 c-jyxqjt-gYqlvA-cv}@media{` +
					`.c-jyxqjt-gYqlvA-cv{--compound:appearance secondary / color lightBlue}` +
				`}`
			)
		})

		test('Render component2({ appearance: "secondary", color: "lightBlue" })', () => {
			const { component2, getCssString } = getFreshComponents()
			const render = component2({ appearance: 'secondary', color: 'lightBlue' })
			expect(render.className).toBe(`c-jyxqjt c-jyxqjt-cOChOn-sv c-jyxqjt-ilDyRi-sv c-jyxqjt-gYqlvA-cv c-dkRcuu`)
			expect(getCssString()).toBe(
				`--stitches{--:2 c-jyxqjt c-dkRcuu}@media{` +
					`.c-jyxqjt{--component:1}` +
					`.c-dkRcuu{--component:2}` +
				`}` +
				`--stitches{--:3 c-jyxqjt-cOChOn-sv c-jyxqjt-ilDyRi-sv}@media{` +
					`.c-jyxqjt-cOChOn-sv{--appearance:secondary}` +
					`.c-jyxqjt-ilDyRi-sv{--color:lightBlue}` +
				`}` +
				`--stitches{--:4 c-jyxqjt-gYqlvA-cv}@media{` +
					`.c-jyxqjt-gYqlvA-cv{--compound:appearance secondary / color lightBlue}` +
				`}`
			)
		})
	})
}) // prettier-ignore
