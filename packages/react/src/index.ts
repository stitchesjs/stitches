import createCore from '@stitches/internal-core'

const reactFactory = (init?: StyledSheetFactoryInit) => create(init)

const create = (init: StyledSheetFactoryInit | undefined) => {
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
				onGlobal(cssOfImportRules: string, cssOfGlobalRules: string) {
					sheetGlobalTextNode.data = cssOfImportRules + cssOfGlobalRules
				},
				onStyled(cssOfStyledRules: string) {
					sheetStyledTextNode.data = cssOfStyledRules
				},
				onThemed(cssOfTheme: string, cssOfThemedRules: string) {
					sheetThemedTextNode.data = cssOfTheme + cssOfThemedRules
				},
		  })
		: createCore((init as unknown) as any)

	const $$typeof = Symbol.for('react.element')
	const $$styled = Symbol.for('stitches.component')

	core.styled = (type: string | anyobject, init: anyobject) => {
		const component = (Object.assign((props: anyobject) => render(props), {
			[$$styled]: true,
			displayName: 'StitchesComponent',
			rule: type[$$styled] ? core.css(type.rule, init) : core.css(init),
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
