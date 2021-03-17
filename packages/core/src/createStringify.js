import { toKebabCase } from '../../stringify/src/toKebabCase.js'
import { stringify } from '../../stringify/src/index.js'
import unitOnlyProps from './unitOnlyProps.js'

/** Token matcher. */
const captureTokens = /([+-])?((?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?)?(\$|--)([$\w-]+)/g

const createStringify = (config) => {
	const { media, themeMap, utils } = config

	return (css) =>
		stringify(css, (property, value) => {
			if (typeof utils[property] === 'function') return utils[property](config)(value)

			const kebabProperty = toKebabCase(property)

			if (typeof utils[kebabProperty] === 'function') return utils[kebabProperty](config)(value)

			const nextProperty = /^\$/.test(property) ? '-' + property.replace(/\$/g, '-') : property

			const nextValue =
				// prettier-ignore
				typeof value === 'number' || typeof value === 'string'
					? unitOnlyProps.test(kebabProperty) && Number(value)
						? String(value) + 'px'
					: String(value).replace(
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
											!/\$/.test(token) && property in themeMap
												? themeMap[property] + '-'
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
				: value

			if (value !== nextValue || property !== nextProperty) return { [nextProperty]: nextValue }

			if (property.startsWith('@when '))
				return {
					['@media' +
					property.slice(5).replace(/(^|\s)([\w-]+)(\s|$)/, ($0, b, v, a) => {
						return b + (v in media ? media[v] : v) + a
					})]: value,
				}

			return null
		})
}

export default createStringify
