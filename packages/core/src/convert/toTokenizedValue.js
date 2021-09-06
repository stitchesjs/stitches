import { toTailDashed } from './toTailDashed.js'

/** Returns a declaration value with transformed token values. */
export const toTokenizedValue = (
	/** @type {string} */
	value,
	/** @type {string} */
	prefix,
	/** @type {string} */
	scale,
) => value.replace(
	/([+-])?((?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?)?(\$|--)([$\w-]+)/g,
	($0, direction, multiplier, separator, token) => (
		separator == "$" == !!multiplier
			? $0
		: (
			direction || separator == '--'
				? 'calc('
			: ''
		) + (
			'var(--' + (
				separator === '$'
					? toTailDashed(prefix) + (
						!token.includes('$')
							? toTailDashed(scale)
						: ''
					) + token.replace(/\$/g, '-')
				: token
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
