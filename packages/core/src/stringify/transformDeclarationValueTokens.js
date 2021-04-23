/** Returns a declaration value with transformed token values. */
export default (
	/** @type {string} */
	camelName,
	/** @type {string} */
	stringValue,
	/** @type {{ prefix: string, themeMap: any }} */
	config
) => stringValue.replace(
	/([+-])?((?:\d+(?:\.\d*)?|\.\d+)(?:[Ee][+-]?\d+)?)?(\$|--)([$\w-]+)/g,
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
					? (
						config.prefix === 'sx'
							? '-'
						: '--' + config.prefix
					) + '-' + (
						!token.includes('$')
							? camelName in config.themeMap
								? config.themeMap[camelName] + '-'
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
) // prettier-ignore
