import { CssPropToToken, cssPropToToken } from './tokens'

const matchAnyDollarSign = /\$/g
const matchTokenProperty = /\$[$-\w]+/g

/** Returns the scale associated with property as a prefix, otherwise an empty string. */
const getResolvedTokenScalePrefix = (property: string | number) =>
	Reflect.has(cssPropToToken, property) ? `${cssPropToToken[property as keyof CssPropToToken]}-` : ''

/** Returns a value with tokens resolved as custom properties. */
const getResolvedValue = (value: number | string, property: number | string) =>
	String(value).replace(
		matchTokenProperty,
		token => `var(--${getResolvedTokenScalePrefix(property)}${token.slice(1).replace(matchAnyDollarSign, '-')})`,
	)

export default getResolvedValue
