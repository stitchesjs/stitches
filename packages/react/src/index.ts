import createCore, { TConditions, TTheme, IConfig, _StyledSheet } from '@stitches/core'

const reactFactory = <Conditions extends TConditions = {}, Theme extends TTheme = {}, Utils = {}, Prefix = ''>(
	/** Configuration of the Stitches instance. */
	init?: IConfig<Conditions, Theme, Utils, Prefix>,
) => {
	let sheetHeadElement: HTMLHeadElement
	let sheetStyleElement: HTMLStyleElement
	let sheetGlobalTextNode: Text
	let sheetStyledTextNode: Text
	let sheetThemedTextNode: Text

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

	core.styled = (type: string | anyobject, init: anyobject) => {
		const component = (Object.assign((props: anyobject) => render(props), {
			[$$styled]: true,
			displayName: 'StitchesComponent',
			rule: type[$$styled]
				? core.css(
						{
							classNames: type.rule.classNames,
							variants: type.rule.variants,
						} as typeof type.rule,
						init,
				  )
				: core.css(init),
			type: type[$$styled] ? type.type : type,
		}) as unknown) as ReactStyledRule

		const render = ({ as, className: classNameOverride, ref = null, ...init }: anyobject) => {
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
