import { toCamelCase, toKebabCase } from '../../stringify/src/toCase.js'
import { stringify } from '../../stringify/src/index.js'
import unitOnlyProps from './unitOnlyProps.js'

/** Token matcher. */
const captureTokens = /([+-])?((?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?)?(\$|--)([$\w-]+)/g

const splitBySpace = /\s+(?![^()]*\))/
const split = (fn) => (data) => fn(...(typeof data === 'string' ? String(data).split(splitBySpace) : [data]))

const mqunit = /([\d.]+)([^]*)/

const polys = {
	// prefixed properties
	appearance: (d) => ({ WebkitAppearance: d, appearance: d }),
	backfaceVisibility: (d) => ({ WebkitBackfaceVisibility: d, backfaceVisibility: d }),
	backgroundClip: (d) => ({ WebkitBackgroundClip: d, backgroundClip: d }),
	boxDecorationBreak: (d) => ({ WebkitBoxDecorationBreak: d, boxDecorationBreak: d }),
	clipPath: (d) => ({ WebkitClipPath: d, clipPath: d }),
	content: (d) => ({ content: !/^([^]*["'][^]*|[A-Za-z]+\([^]*|[^]*-quote|inherit|initial|none|normal|revert|unset)$/.test(d) ? `"${d}"` : d }),
	hyphens: (d) => ({ WebkitHyphens: d, hyphens: d }),
	maskImage: (d) => ({ WebkitMaskImage: d, maskImage: d }),
	tabSize: (d) => ({ MozTabSize: d, tabSize: d }),
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
	const { media, prefix, themeMap, utils } = config

	let lastRegxName
	let lastRegxData
	let lastUtilFunc
	let lastUtilData

	return (css) =>
		stringify(css, (name, data) => {
			const firstChar = name.charCodeAt(0)
			const camelName = firstChar === 64 ? name : toCamelCase(name)
			const kebabName = firstChar === 64 ? name : toKebabCase(name)

			if (typeof utils[name] === 'function') {
				// run utilities that match the raw left-hand of the CSS rule or declaration
				if (utils[name] != lastUtilFunc || data != lastUtilData) {
					lastUtilFunc = utils[name]
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

			if (lastRegxName != camelName && lastRegxData != data && /^((min|max)?((Block|Inline)Size|Height|Width)|height|width)$/.test(camelName)) {
				lastRegxName = camelName
				lastRegxData = data

				const redata = String(lastRegxData).replace(
					/^((?:[^]*[^\w-])?)(fit-content|stretch)((?:[^\w-][^]*)?)$/,
					(data, lead, main, tail) => lead + (main === 'stretch' ? `-moz-available${tail};${kebabName}:${lead}-webkit-fill-available` : `-moz-fit-content${tail};${kebabName}:${lead}fit-content`) + tail,
				)

				if (redata != data) {
					return {
						[name]: redata,
					}
				}
			}

			// prettier-ignore

			/** CSS left-hand side value, which may be a specially-formatted custom property. */
			let customName = (
				// prettier-ignore
				firstChar === 64
					? (
						name.slice(1) in media
							? '@media ' + media[name.slice(1)]
						: name
					).replace(/\(\s*([\w-]+)\s*(=|<|<=|>|>=)\s*([\w-]+)\s*(?:(<|<=|>|>=)\s*([\w-]+)\s*)?\)/g, (_, a, l, b, r, c) => {
						const isValueFirst = mqunit.test(a)
						const shift = 0.0625 * (isValueFirst ? -1 : 1)
						const [name, value] = isValueFirst ? [b, a] : [a, b]

						return (
							// prettier-ignore
							'(' +
								(
									l[0] === '=' ? '' : (l[0] === '>' === isValueFirst ? 'max-' : 'min-')
								) + name + ':' +
								(l[0] !== '=' && l.length === 1 ? value.replace(mqunit, (_, v, u) => Number(v) + shift * (l === '>' ? 1 : -1) + u) : value) +
								(
									r
										? ') and (' + (
											(r[0] === '>' ? 'min-' : 'max-') + name + ':' +
											(r.length === 1 ? c.replace(mqunit, (_, v, u) => Number(v) + shift * (r === '>' ? -1 : 1) + u) : c)
										)
									: ''
								) +
							')'
						)
					})
				: firstChar === 36
					? '--' + prefix + name.replace(/\$/g, '-')
				: name
			)

			// prettier-ignore

			/** CSS right-hand side value, which may be a specially-formatted custom property. */
			const customData = (
				// preserve object-like data
				typeof data === 'object' && data
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
									? '--' + prefix + '-' + (
										!token.includes('$')
											? camelName in themeMap
												? themeMap[camelName] + '-'
											: ''
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
			)

			if (data != customData || kebabName != customName) {
				return {
					[customName]: customData,
				}
			}

			return null
		})
}
