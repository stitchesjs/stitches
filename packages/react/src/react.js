import createCore, { _StyledSheet } from '@stitches/core'

/**
 * Returns a new StyledSheet.
 * @type {import('./types').ReactFactory}
 */
const reactFactory = (
	/** Configuration of the Stitches instance. */
	init,
) => {
	let sheetHeadElement
	let sheetStyleElement
	let sheetGlobalTextNode
	let sheetStyledTextNode
	let sheetThemedTextNode

	const hasDocument = typeof document === 'object'

	if (hasDocument) {
		sheetGlobalTextNode = new Text('')
		sheetStyledTextNode = new Text('')
		sheetThemedTextNode = new Text('')
		sheetStyleElement = document.createElement('style')
		sheetHeadElement = document.head

		sheetStyleElement.append(sheetGlobalTextNode)
		sheetStyleElement.append(sheetThemedTextNode)
		sheetStyleElement.append(sheetStyledTextNode)
		sheetHeadElement.append(sheetStyleElement)
	}

	const core = hasDocument
		? createCore({
				...Object(init),
				onGlobal(cssOfImportRules, cssOfGlobalRules) {
					sheetGlobalTextNode.data = cssOfImportRules + cssOfGlobalRules
				},
				onStyled(cssOfStyledRules) {
					sheetStyledTextNode.data = cssOfStyledRules
				},
				onThemed(cssOfTheme, cssOfThemedRules) {
					sheetThemedTextNode.data = cssOfTheme + cssOfThemedRules
				},
		  })
		: createCore(init)

	const $$typeof = Symbol.for('react.element')
	const $$styled = Symbol.for('stitches.component')

	core.styled = (type, init) => {
		const component = Object.assign(props => render(props), {
			[$$styled]: true,
			displayName: 'StitchesComponent',
			rule: type[$$styled]
				? core.css(
						{
							classNames: type.rule.classNames,
							variants: type.rule.variants,
						},
						init,
				  )
				: core.css(init),
			type: type[$$styled] ? type.type : type,
		})

		const render = ({ as, className: classNameOverride, ref = null, ...init }) => {
			const classNameOverrides = String(classNameOverride || '').split(/\s+/)
			const expression = component.rule(init)

			const { classNames, props } = expression

			return {
				$$typeof,
				key: null,
				props: {
					...props,
					className: classNames.concat(classNameOverrides).filter(Boolean).join(' '),
				},
				ref,
				type: as || component.type,
				_owner: null,
			}
		}

		return component
	}

	return core
}

export default reactFactory
