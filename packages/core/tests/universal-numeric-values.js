import { createStitches } from '../src/index.js'

describe('Numeric Values', () => {
	test('Authors can use numeric values to assign px values', () => {
		const { globalCss, toString } = createStitches()

		expect(toString()).toBe('')

		globalCss({
			body: {
				margin: 0,
			},
		})()

		expect(toString()).toBe(`--sxs{--sxs:1 cSHHDh}@media{body{margin:0}}`)

		globalCss({
			body: {
				margin: 10,
			},
		})()

		expect(toString()).toBe(`--sxs{--sxs:1 cSHHDh fFIrKk}@media{body{margin:0}body{margin:10px}}`)
	})

	test('Authors can use numeric values to assign numeric values', () => {
		const { globalCss, toString } = createStitches()

		expect(toString()).toBe('')

		globalCss({
			body: {
				lineHeight: 0,
				width: 0,
			},
		})()

		expect(toString()).toBe(`--sxs{--sxs:1 bpctHq}@media{body{line-height:0;width:0}}`)

		globalCss({
			body: {
				lineHeight: 10,
				width: 10,
			},
		})()

		expect(toString()).toBe(`--sxs{--sxs:1 bpctHq cudWGu}@media{body{line-height:0;width:0}body{line-height:10;width:10px}}`)
	})

	test('Authors can use unit-less properties as known to React', () => {
		for (let i = 0; i <= 33; i += 11) {
			const { globalCss, getCssText } = createStitches()

			globalCss({
				div: {
					animationIterationCount: i,
					borderImageOutset: i,
					borderImageSlice: i,
					borderImageWidth: i,
					boxFlex: i,
					boxFlexGroup: i,
					boxOrdinalGroup: i,
					columnCount: i,
					columns: i,
					flex: i,
					flexGrow: i,
					flexShrink: i,
					flexOrder: i,
					gridRow: i,
					gridRowEnd: i,
					gridRowSpan: i,
					gridRowStart: i,
					gridColumn: i,
					gridColumnEnd: i,
					gridColumnSpan: i,
					gridColumnStart: i,
					fontWeight: i,
					lineClamp: i,
					lineHeight: i,
					opacity: i,
					order: i,
					orphans: i,
					tabSize: i,
					widows: i,
					zIndex: i,
					zoom: i,
				},
			})()

			const cssText = getCssText().replace(/^.+@media\{|\}$/g, '')

			expect(cssText).toBe(
				'div' + '{' +
					'animation-iteration-count:' + i + ';' +
					'border-image-outset:' + i + ';' +
					'border-image-slice:' + i + ';' +
					'border-image-width:' + i + ';' +
					'box-flex:' + i + ';' +
					'box-flex-group:' + i + ';' +
					'box-ordinal-group:' + i + ';' +
					'column-count:' + i + ';' +
					'columns:' + i + ';' +
					'flex:' + i + ';' +
					'flex-grow:' + i + ';' +
					'flex-shrink:' + i + ';' +
					'flex-order:' + i + ';' +
					'grid-row:' + i + ';' +
					'grid-row-end:' + i + ';' +
					'grid-row-span:' + i + ';' +
					'grid-row-start:' + i + ';' +
					'grid-column:' + i + ';' +
					'grid-column-end:' + i + ';' +
					'grid-column-span:' + i + ';' +
					'grid-column-start:' + i + ';' +
					'font-weight:' + i + ';' +
					'line-clamp:' + i + ';' +
					'line-height:' + i + ';' +
					'opacity:' + i + ';' +
					'order:' + i + ';' +
					'orphans:' + i + ';' +
					'-moz-tab-size:' + i + ';' +
					'tab-size:' + i + ';' +
					'widows:' + i + ';' +
					'z-index:' + i + ';' +
					'zoom:' + i +
				'}'
			)
		}
	})

	const commonProps = 'fontSize margin marginTop marginRight marginBottom marginLeft padding paddingTop paddingRight paddingBottom paddingLeft'.split(' ')

	for (const prop of commonProps) {
		const kebabProp = prop.replace(/[A-Z]/g, (letter) => '-' + letter.toLowerCase())

		test(`Author can use the unit-only ${kebabProp} property`, () => {
			for (let i = 0; i <= 33; i += 11) {
				const { globalCss, getCssText } = createStitches()

				globalCss({
					div: {
						[prop]: i,
					},
				})()

				const cssText = getCssText().replace(/^.+@media\{|\}$/g, '')

				expect(cssText).toBe(
					`div{` +
						kebabProp + `:` + i + (i ? 'px' : '') +
					`}`
				)
			}
		})
	}
}) // prettier-ignore
