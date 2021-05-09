import { toCamelCase, toKebabCase } from '../../stringify/src/toCase.js'
import { stringify } from '../../stringify/src/index.js'
import transformDeclarationSizingValue from './stringify/transformDeclarationSizingValue.js'
import transformDeclarationValueTokens from './stringify/transformDeclarationValueTokens.js'
import transformMediaQueryRanges from './stringify/transformMediaQueryRanges.js'
import sizeProps from './stringify/sizeProps.js'
import unitProps from './stringify/unitProps.js'

const splitBySpace = /\s+(?![^()]*\))/
const split = (fn) => (data) => fn(...(typeof data === 'string' ? String(data).split(splitBySpace) : [data]))
const toJson = JSON.stringify

const polys = {
	// prefixed properties
	appearance: (d) => ({ WebkitAppearance: d, appearance: d }),
	backfaceVisibility: (d) => ({ WebkitBackfaceVisibility: d, backfaceVisibility: d }),
	backdropFilter: (d) => ({ WebkitBackdropFilter: d, backdropFilter: d }),
	backgroundClip: (d) => ({ WebkitBackgroundClip: d, backgroundClip: d }),
	boxDecorationBreak: (d) => ({ WebkitBoxDecorationBreak: d, boxDecorationBreak: d }),
	clipPath: (d) => ({ WebkitClipPath: d, clipPath: d }),
	content: (d) => ({ content: d.includes('"') || d.includes("'") || /^([A-Za-z]+\([^]*|[^]*-quote|inherit|initial|none|normal|revert|unset)$/.test(d) ? d : `"${d}"` }),
	hyphens: (d) => ({ WebkitHyphens: d, hyphens: d }),
	maskImage: (d) => ({ WebkitMaskImage: d, maskImage: d }),
	tabSize: (d) => ({ MozTabSize: d, tabSize: d }),
	textSizeAdjust: (d) => ({ WebkitTextSizeAdjust: d, MozTextSizeAdjust: d, textSizeAdjust: d }),
	userSelect: (d) => ({ WebkitUserSelect: d, userSelect: d }),

	// logical properties
	marginBlock: split((s, e) => ({ marginBlockStart: s, marginBlockEnd: e || s })),
	marginInline: split((s, e) => ({ marginInlineStart: s, marginInlineEnd: e || s })),
	maxSize: split((b, i) => ({ maxBlockSize: b, maxInlineSize: i || b })),
	minSize: split((b, i) => ({ minBlockSize: b, minInlineSize: i || b })),
	paddingBlock: split((s, e) => ({ paddingBlockStart: s, paddingBlockEnd: e || s })),
	paddingInline: split((s, e) => ({ paddingInlineStart: s, paddingInlineEnd: e || s })),
}

export const createStringify = (config) => {
	let lastRegxName
	let lastRegxData
	let lastUtilFunc
	let lastUtilData

	const memo = {}

	return (css) => {
		const jss = toJson(css)

		if (jss in memo) return memo[jss]

		return memo[jss] = stringify(
			css,
			(name, data) => {
				const firstChar = name.charCodeAt(0)
				const camelName = firstChar === 64 ? name : toCamelCase(name)
				const kebabName = firstChar === 64 ? name : toKebabCase(name)

				if (typeof config.utils[name] === 'function') {
					// run utilities that match the raw left-hand of the CSS rule or declaration
					if (config.utils[name] != lastUtilFunc || data != lastUtilData) {
						lastUtilFunc = config.utils[name]
						lastUtilData = data

						return lastUtilFunc(config)(lastUtilData)
					}
				} else if (typeof polys[camelName] === 'function') {
					// run polyfills that match the camel-case-left hand of the CSS declaration
					if (polys[camelName] != lastUtilFunc || data != lastUtilData) {
						lastUtilFunc = polys[camelName]
						lastUtilData = data

						return lastUtilFunc(lastUtilData)
					}
				}

				lastUtilData = data

				if (lastRegxName != camelName && lastRegxData != data && kebabName in sizeProps) {
					lastRegxName = camelName
					lastRegxData = data

					const redata = transformDeclarationSizingValue(kebabName, String(lastRegxData))

					if (redata != data) {
						return {
							[name]: redata,
						}
					}
				}

				/** CSS left-hand side value, which may be a specially-formatted custom property. */
				let customName = (
					// whether the first character is a "@"
					firstChar === 64
						? transformMediaQueryRanges(
							name.slice(1) in config.media
								? '@media ' + config.media[name.slice(1)]
							: name
						)
					// whether the first character is a "$"
					: firstChar === 36
						? (config.prefix === 'sx' ? '-' : '--' + config.prefix) + name.replace(/\$/g, '-')
					: name
				)

				/** CSS right-hand side value, which may be a specially-formatted custom property. */
				const customData = (
					// preserve object-like data
					typeof data === 'object' && data
						? data
					// replace specially-marked numeric property values with pixel versions
					: typeof data === 'number' && data && camelName in unitProps
						? String(data) + 'px'
					// replace tokens with stringified primitive values
					: transformDeclarationValueTokens(camelName, String(data), config)
				)

				if (data != customData || kebabName != customName) {
					return {
						[customName]: customData,
					}
				}

				return null
			}
		)
	}
} // prettier-ignore
