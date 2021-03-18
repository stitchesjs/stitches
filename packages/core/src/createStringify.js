import { toKebabCase } from '../../stringify/src/toKebabCase.js'
import { stringify } from '../../stringify/src/index.js'
import unitOnlyProps from './unitOnlyProps.js'

/** Token matcher. */
const captureTokens = /([+-])?((?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?)?(\$|--)([$\w-]+)/g

const splitBySpace = /\s+(?![^()]*\))/
const split = (fn) => (data) => fn(...String(data).split(splitBySpace))

// prettier-ignore
const patches = {
	// prefixed properties
	'appearance': (d) => ({ WebkitAppearance: d, appearance: d }),
	'backface-visibility': (d) => ({ WebkitBackfaceVisibility: d, backfaceVisibility: d }),
	'background-clip': (d) => ({ WebkitBackgroundClip: d, backgroundClip: d }),
	'clip-path': (d) => ({ WebkitClipPath: d, clipPath: d }),
	'hyphens': (d) => ({ WebkitHyphens: d, hyphens: d }),
	'mask-image': (d) => ({ WebkitMaskImage: d, maskImage: d }),
	'tab-size': (d) => ({ MozTabSize: d, tabSize: d }),
	'user-select': (d) => ({ WebkitUserSelect: d, userSelect: d }),

	// logical properties
	'margin-block': split((s, e) => ({ marginBlockStart: s, marginBlockEnd: e || s })),
	'margin-inline': split((s, e) => ({ marginInlineStart: s, marginInlineEnd: e || s })),
	'max-size': split((b, i) => ({ maxBlockSize: b, maxInlineSize: i || b })),
	'min-size': split((b, i) => ({ minBlockSize: b, minInlineSize: i || b })),
	'padding-block': split((s, e) => ({ paddingBlockStart: s, paddingBlockEnd: e || s })),
	'padding-inline': split((s, e) => ({ paddingInlineStart: s, paddingInlineEnd: e || s })),

	// 'inset': split((t, r, b, l) => ({ top: t, right: r || t, bottom: b || t, left: l || r || t })),
	// 'inset-block-end': () => (e) => ({ bottom: e }),
	// 'inset-block-start': () => (s) => ({ top: s }),
	// 'inset-block': split((s, e) => ({ top: s, bottom: e || s })),
	// 'inset-inline-end': () => (e) => ({ ':where([dir="ltr"]) &': { right: e }, ':where([dir="rtl"]) &': { left: e } }),
	// 'inset-inline-start': () => (s) => ({ ':where([dir="ltr"]) &': { left: s }, ':where([dir="rtl"]) &': { right: s } }),
	// 'inset-inline': split((s, e) => (s === e ? { left: s, right: e } : { insetInlineStart: s, insetInlineEnd: e })),
	// 'size': split((b, i) => ({ blockSize: b, inlineSize: i || b })),
}

const createStringify = (config) => {
	const { media, themeMap, utils } = config

	return (css) =>
		stringify(css, (name, data) => {
			// run utilities that match the raw left-hand of the CSS rule or declaration
			if (typeof utils[name] === 'function') return utils[name](config)(data)

			const kebabProperty = toKebabCase(name)

			// run utilities that match the kebab-case left-hand of the CSS rule or declaration
			if (typeof utils[kebabProperty] === 'function') return utils[kebabProperty](config)(data)

			if (kebabProperty in patches) {
				return patches[kebabProperty](data)
			}

			const firstChar = name.charCodeAt(0)

			/** CSS property name, which may be a specially-formatted custom property. */
			const customName = firstChar === 36 ? '-' + name.replace(/\$/g, '-') : name

			const customData =
				// prettier-ignore

				// preserve object-like data
				data === Object(data)
					? data
				// replace specially-marked numeric property values with pixel versions
				: data && typeof data === 'number' && unitOnlyProps.test(kebabProperty)
						? String(data) + 'px'
				// replace tokens with stringified primitive values
				: String(data).replace(
					captureTokens,
					($0, direction, multiplier, separator, token) => (
						separator == "$" == !!multiplier
							? $0
						: (
							direction || separator == '--'
								? 'calc('
							: ''
						) + (
							'var(' + (
								separator === '$'
									? '--' + (
										!/\$/.test(token) && name in themeMap
											? themeMap[name] + '-'
										: ''
									) + token.replace(/\$/g, '-')
								: separator + token
							) + ')' + (
								direction || separator == '--'
									? '*' + (
										direction || ''
									) + (
										multiplier || '1'
									) + ')'
								: ''
							)
						)
					),
				)

			if (data !== customData || name !== customName) {
				return {
					[customName]: customData,
				}
			}

			if (firstChar === 64 && name.slice(1) in media) {
				return {
					['@media ' + media[name.slice(1)]]: data,
				}
			}

			return null
		})
}

export default createStringify
