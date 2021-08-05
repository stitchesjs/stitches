import { toCamelCase } from './toCamelCase.js'
import { toHyphenCase } from './toHyphenCase.js'
import { toPolyfilledValue } from './toPolyfilledValue.js'
import { toResolvedMediaQueryRanges } from './toResolvedMediaQueryRanges.js'
import { toResolvedSelectors } from './toResolvedSelectors.js'
import { toSizingValue } from './toSizingValue.js'
import { toTailDashed } from './toTailDashed.js'
import { toTokenizedValue } from './toTokenizedValue.js'

/** @typedef {import('../createStitches.js').Config} Config */
/** @typedef {import('../createStitches.js').Style} Style */

/** Comma matcher outside rounded brackets. */
const comma = /\s*,\s*(?![^()]*\))/

/** Default toString method of Objects. */
const toStringOfObject = Object.prototype.toString

export const toCssRules = (
	/** @type {Style} */ style,
	/** @type {string[]} */ selectors,
	/** @type {string[]} */ conditions,
	/** @type {Config} */ config,
	/** @type {(cssText: string) => any} */ onCssText
) => {
	/** @type {[string[], string[], string[]]} CSSOM-compatible rule being created. */
	let currentRule = undefined

	/** Last utility that was used, cached to prevent recursion. */
	let lastUtil

	/** Last polyfill that was used, cached to prevent recursion. */
	let lastPoly

	/** Walks CSS styles and converts them into CSSOM-compatible rules. */
	const walk = (
		/** @type {Style} Set of CSS styles */ style,
		/** @type {string[]} Selectors that define the elements to which a set of CSS styles apply. */ selectors,
		/** @type {string[]} Conditions that define the queries to which a set of CSS styles apply. */ conditions,
	) => {
		/** @type {keyof style} Represents the left-side "name" for the property (the at-rule prelude, style-rule selector, or declaration name). */
		let name

		/** @type {style[keyof style]} Represents the right-side "data" for the property (the rule block, or declaration value). */
		let data

		const each = (style) => {
			for (name in style) {
				/** Whether the current name represents an at-rule. */
				const isAtRuleLike = name.charCodeAt(0) === 64

				const datas = isAtRuleLike && Array.isArray(style[name]) ? style[name] : [style[name]]

				for (data of datas) {
					/** Whether the current data represents a nesting rule. */
					const isRuleLike = typeof data === 'object' && data && data.toString === toStringOfObject

					const camelName = toCamelCase(name)

					// if the left-hand "name" matches a configured utility
					// conditionally transform the current data using the configured utility
					if (camelName in config.utils) {
						const util = config.utils[camelName]

						if (util !== lastUtil) {
							lastUtil = util

							each(util(data))

							lastUtil = null

							continue
						}
					}
					// otherwise, if the left-hand "name" matches a configured polyfill
					// conditionally transform the current data using the polyfill
					else if (camelName in toPolyfilledValue) {
						const poly = toPolyfilledValue[camelName]

						if (poly !== lastPoly) {
							lastPoly = poly

							each(poly(data))

							lastPoly = null

							continue
						}
					}

					// if the left-hand "name" matches a configured at-rule
					if (isAtRuleLike) {
						// transform the current name with the configured media at-rule prelude
						name = toResolvedMediaQueryRanges(name.slice(1) in config.media ? '@media ' + config.media[name.slice(1)] : name)
					}

					if (isRuleLike) {
						/** Next conditions, which may include one new condition (if this is an at-rule). */
						const nextConditions = isAtRuleLike ? conditions.concat(name) : [...conditions]

						/** Next selectors, which may include one new selector (if this is not an at-rule). */
						const nextSelections = isAtRuleLike ? [...selectors] : toResolvedSelectors(selectors, name.split(comma))

						if (currentRule !== undefined) {
							onCssText(toCssString(...currentRule))
						}

						currentRule = undefined

						walk(data, nextSelections, nextConditions)
					} else {
						if (currentRule === undefined) currentRule = [[], selectors, conditions]

						/** CSS left-hand side value, which may be a specially-formatted custom property. */
						name = !isAtRuleLike && name.charCodeAt(0) === 36 ? `--${toTailDashed(config.prefix)}${name.slice(1).replace(/\$/g, '-')}` : name

						/** CSS right-hand side value, which may be a specially-formatted custom property. */
						data = (
							// preserve object-like data
							isRuleLike ? data
							// replace specially-marked numeric property values with pixel versions
							: typeof data === 'number'
								? data && camelName in unitProps
									? String(data) + 'px'
								: String(data)
							// replace tokens with stringified primitive values
							: toTokenizedValue(
								toSizingValue(camelName, data == null ? '' : data),
								config.prefix,
								config.themeMap[camelName]
							)
						)

						currentRule[0].push(`${isAtRuleLike ? `${name} ` : `${toHyphenCase(name)}:`}${data}`)
					}
				}
			}
		}

		each(style)

		if (currentRule !== undefined) {
			onCssText(toCssString(...currentRule))
		}
		currentRule = undefined
	}

	walk(style, selectors, conditions)
} // prettier-ignore

const toCssString = (/** @type {string[]} */ declarations, /** @type {string[]} */ selectors, /** @type {string[]} */ conditions) => (
	`${conditions.map((condition) => `${condition}{`).join('')}${selectors.length ? `${selectors.join(',')}{` : ''}${declarations.join(';')}${selectors.length ? `}` : ''}${Array(conditions.length ? conditions.length + 1 : 0).join('}')}`
) // prettier-ignore

/** CSS Properties whose number value may safely be interpretted as a pixel. */
export const unitProps = {
	animationDelay: 1,
	animationDuration: 1,
	backgroundSize: 1,
	blockSize: 1,
	border: 1,
	borderBlock: 1,
	borderBlockEnd: 1,
	borderBlockEndWidth: 1,
	borderBlockStart: 1,
	borderBlockStartWidth: 1,
	borderBlockWidth: 1,
	borderBottom: 1,
	borderBottomLeftRadius: 1,
	borderBottomRightRadius: 1,
	borderBottomWidth: 1,
	borderEndEndRadius: 1,
	borderEndStartRadius: 1,
	borderInlineEnd: 1,
	borderInlineEndWidth: 1,
	borderInlineStart: 1,
	borderInlineStartWidth: 1,
	borderInlineWidth: 1,
	borderLeft: 1,
	borderLeftWidth: 1,
	borderRadius: 1,
	borderRight: 1,
	borderRightWidth: 1,
	borderSpacing: 1,
	borderStartEndRadius: 1,
	borderStartStartRadius: 1,
	borderTop: 1,
	borderTopLeftRadius: 1,
	borderTopRightRadius: 1,
	borderTopWidth: 1,
	borderWidth: 1,
	bottom: 1,
	columnGap: 1,
	columnRule: 1,
	columnRuleWidth: 1,
	columnWidth: 1,
	containIntrinsicSize: 1,
	flexBasis: 1,
	fontSize: 1,
	gap: 1,
	gridAutoColumns: 1,
	gridAutoRows: 1,
	gridTemplateColumns: 1,
	gridTemplateRows: 1,
	height: 1,
	inlineSize: 1,
	inset: 1,
	insetBlock: 1,
	insetBlockEnd: 1,
	insetBlockStart: 1,
	insetInline: 1,
	insetInlineEnd: 1,
	insetInlineStart: 1,
	left: 1,
	letterSpacing: 1,
	margin: 1,
	marginBlock: 1,
	marginBlockEnd: 1,
	marginBlockStart: 1,
	marginBottom: 1,
	marginInline: 1,
	marginInlineEnd: 1,
	marginInlineStart: 1,
	marginLeft: 1,
	marginRight: 1,
	marginTop: 1,
	maxBlockSize: 1,
	maxHeight: 1,
	maxInlineSize: 1,
	maxWidth: 1,
	minBlockSize: 1,
	minHeight: 1,
	minInlineSize: 1,
	minWidth: 1,
	offsetDistance: 1,
	offsetRotate: 1,
	outline: 1,
	outlineOffset: 1,
	outlineWidth: 1,
	overflowClipMargin: 1,
	padding: 1,
	paddingBlock: 1,
	paddingBlockEnd: 1,
	paddingBlockStart: 1,
	paddingBottom: 1,
	paddingInline: 1,
	paddingInlineEnd: 1,
	paddingInlineStart: 1,
	paddingLeft: 1,
	paddingRight: 1,
	paddingTop: 1,
	perspective: 1,
	right: 1,
	rowGap: 1,
	scrollMargin: 1,
	scrollMarginBlock: 1,
	scrollMarginBlockEnd: 1,
	scrollMarginBlockStart: 1,
	scrollMarginBottom: 1,
	scrollMarginInline: 1,
	scrollMarginInlineEnd: 1,
	scrollMarginInlineStart: 1,
	scrollMarginLeft: 1,
	scrollMarginRight: 1,
	scrollMarginTop: 1,
	scrollPadding: 1,
	scrollPaddingBlock: 1,
	scrollPaddingBlockEnd: 1,
	scrollPaddingBlockStart: 1,
	scrollPaddingBottom: 1,
	scrollPaddingInline: 1,
	scrollPaddingInlineEnd: 1,
	scrollPaddingInlineStart: 1,
	scrollPaddingLeft: 1,
	scrollPaddingRight: 1,
	scrollPaddingTop: 1,
	shapeMargin: 1,
	textDecoration: 1,
	textDecorationThickness: 1,
	textIndent: 1,
	textUnderlineOffset: 1,
	top: 1,
	transitionDelay: 1,
	transitionDuration: 1,
	verticalAlign: 1,
	width: 1,
	wordSpacing: 1,
}
