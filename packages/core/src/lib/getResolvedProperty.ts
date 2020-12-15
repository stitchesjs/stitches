const matchAnyCapitalLetter = /[A-Z]/g
const matchTokenProperty = /^\$[$-\w]/
const matchAnyDollarSign = /\$/g

/** Returns a property resolved as a custom property from a token or kebab-cased from camel-cased. */
const getResolvedProperty = (property: string) =>
	matchTokenProperty.test(property)
		? '--' + property.slice(1).replace(matchAnyDollarSign, '-')
		: property.replace(matchAnyCapitalLetter, $0 => '-' + $0.toLowerCase())

export default getResolvedProperty
