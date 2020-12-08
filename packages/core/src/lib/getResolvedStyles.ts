import getResolvedAtRulePrelude from './getResolvedAtRulePrelude'
import getResolvedProperty from './getResolvedProperty'
import getResolvedSelectors from './getResolvedSelectors'
import getResolvedValue from './getResolvedValue'
import getSplitSelector from './getSplitSelector'

declare type GenericProperties = {
	[propertyOrSelector in string]: string | number | GenericProperties
}

export type ExchangableProperties = {
	[property in string]: (
		value: number | string,
	) => {
		[property in number | string]: number | string
	}
}

const isAtRulePrelude = (prelude: string): prelude is `@${string}` | `$when\$${string}` => {
	return prelude.charCodeAt(0) === 64 || prelude.slice(0, 5) === 'when$'
}

/** Returns CSS text resolved from mixed properties. */
const getResolvedStyles = (
	/** Properties like `{ color: 'tomato' }` */
	styles: GenericProperties,
	/** Selectors like `body` or `&:hover` */
	selectorials: string[],
	/** Conditionals like `@media` or `@font-face` */
	conditionals: string[],
	/** Property Functions like `(value) => ({ marginLeft: value, marginRight: value })` */
	sheet: StyledSheet,
) => {
	let cssText = ''

	let hasDeclarationBlock: boolean = false

	const hasConditionals = Boolean(conditionals.length)
	const hasSelectorials = Boolean(selectorials.length)

	/** Adds the opening portion of a declaration block */
	const addDeclarationBlockOpening = () => {
		cssText += hasConditionals ? conditionals.join('{') + '{' : ''
		cssText += hasSelectorials ? selectorials.join(',') : ''
		cssText += hasSelectorials ? '{' : ''
	}

	/** Adds the closing portion of a declaration block */
	const addDeclarationBlockClosing = () => {
		cssText += '}'.repeat(conditionals.length + (hasSelectorials ? 1 : 0))
	}

	const processTheme = (name: string, data: any) => {
		const props = {} as { [key: string]: string }
		for (const scaleName in data) {
			const scale = Object(data[scaleName])
			for (const tokenName in scale) {
				props[`\$${scaleName}-${tokenName}`] = String(scale[tokenName])
			}
		}
		return props
	}

	const processRules = (props: any) => {
		for (const name in props) {
			const data = props[name]

			if (data === Object(data)) {
				// the rule is either a nested condition or a nested selector

				// close an existing declaration block
				if (hasDeclarationBlock) {
					addDeclarationBlockClosing()
					hasDeclarationBlock = false
				}

				if (isAtRulePrelude(name)) {
					// add the CSS of a nested condition block (like `@media all`)
					cssText += getResolvedStyles(
						data,
						selectorials,
						[...conditionals, getResolvedAtRulePrelude(name, sheet)],
						sheet,
					)
				} else if (name === 'theme') {
					// the rule is a theme

					// add the CSS of a theme block
					cssText += getResolvedStyles(processTheme(name, data), selectorials, conditionals, sheet)
				} else {
					// add the CSS of a nested selector block (like `&:focus`)
					cssText += getResolvedStyles(
						data,
						hasSelectorials ? getResolvedSelectors(selectorials, getSplitSelector(name)) : getSplitSelector(name),
						conditionals,
						sheet,
					)
				}
			} else if (name in sheet.properties) {
				// the rule is forwarded to a utility

				processRules(sheet.properties[name](data))
			} else {
				// the rule is a declaration block

				// open an new declaration block
				if (!hasDeclarationBlock) {
					addDeclarationBlockOpening()
					hasDeclarationBlock = true
				}

				const divider = isAtRulePrelude(name) ? ' ' : ':'

				cssText += getResolvedProperty(name) + divider + getResolvedValue(data, name) + ';'
			}
		}
	}

	processRules(styles)

	if (hasDeclarationBlock) addDeclarationBlockClosing()

	return cssText
}

export default getResolvedStyles
