import { toKebabCase } from '../../stringify/src/toKebabCase.js'
import { stringify } from '../../stringify/src/index.js'
import unitOnlyProps from './unitOnlyProps.js'

/** Token matcher. */
const captureTokens = /([+-])?((?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?)?(\$|--)([$\w-]+)/g

const createStringify = (config) => {
	const { media, themeMap, utils } = config

	return (css) =>
		stringify(css, (name, data) => {
			// run utilities that match the raw left-hand of the CSS rule or declaration
			if (typeof utils[name] === 'function') return utils[name](config)(data)

			const kebabProperty = toKebabCase(name)

			// run utilities that match the kebab-case left-hand of the CSS rule or declaration
			if (typeof utils[kebabProperty] === 'function') return utils[kebabProperty](config)(data)

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
