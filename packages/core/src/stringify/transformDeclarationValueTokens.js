import { toTailDashed } from '../convert/toDashed.js'

/** Returns a declaration value with transformed token values. */
export const transformDeclarationValueTokens = (
	/** @type {string} */
	value,
	/** @type {string | undefined} */
	prefix,
	/** @type {string | undefined} */
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
) // prettier-ignore
