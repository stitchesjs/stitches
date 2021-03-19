import { toKebabCase } from '../../stringify/src/toKebabCase.js'
import { stringify } from '../../stringify/src/index.js'
import unitOnlyProps from './unitOnlyProps.js'

/** Token matcher. */
const captureTokens = /([+-])?((?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?)?(\$|--)([$\w-]+)/g

const splitBySpace = /\s+(?![^()]*\))/
const split = (fn) => (data) => fn(...(typeof data === 'string' ? String(data).split(splitBySpace) : [data]))

const patches = {
	// prefixed properties
	'appearance': (d) => ({ WebkitAppearance: d, appearance: d }),
	'backface-visibility': (d) => ({ WebkitBackfaceVisibility: d, backfaceVisibility: d }),
	'background-clip': (d) => ({ WebkitBackgroundClip: d, backgroundClip: d }),
	'clip-path': (d) => ({ WebkitClipPath: d, clipPath: d }),
	'content': (d) => ({ content: !/^([^]*["'][^]*|[A-Za-z]+\([^]*|[^]*-quote|inherit|initial|none|normal|revert|unset)$/.test(d) ? `"${d}"` : d }),
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
}

export const createStringify = (config) => {
	const { media, themeMap, utils } = config

	let lastUtil
	let lastData

	return (css) =>
		stringify(css, (name, data) => {
			// run utilities that match the raw left-hand of the CSS rule or declaration
			if (typeof utils[name] === 'function' && (data !== lastData || utils[name] !== lastUtil)) {
				return (lastUtil = utils[name])(config)((lastData = data))
			}

			const kebabName = toKebabCase(name)

			// run utilities that match the kebab-case left-hand of the CSS rule or declaration
			if (typeof utils[kebabName] === 'function' && (data !== lastData || utils[kebabName] !== lastUtil)) {
				return (lastUtil = utils[kebabName])(config)((lastData = data))
			}

			if (kebabName in patches && (data !== lastData || patches[kebabName] !== lastUtil)) {
				return (lastUtil = patches[kebabName])((lastData = data))
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
				: data && typeof data === 'number' && unitOnlyProps.test(kebabName)
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
