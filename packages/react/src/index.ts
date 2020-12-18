import createCore from '@stitches/core'

const reactFactory = (init?: StyledSheetFactoryInit) => create(init)

const create = (init: StyledSheetFactoryInit | undefined) => {
	const core = createCore(init) as ReactStyledSheet
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
