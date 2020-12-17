import createCore from '@stitches/core'

const reactFactory = (init?: StyledSheetFactoryInit) => create(init)

const create = (init: StyledSheetFactoryInit | undefined) => {
	const core = createCore(init)
	const $$typeof = Symbol.for('react.element')

	core.styled = (type: string | anyobject, init: anyobject) => {
		if ('$$typeof' in Object(type)) {
			// @todo, extend other components
		}

		const rule = core.css(init)
		const displayType = typeof type === 'string' ? type : 'Component'

		return Object.assign(
			({ as, className: classNameOverride, ref = null, ...init }: anyobject) => {
				const classNameOverrides = String(classNameOverride || '').split(/\s+/)
				const expression = rule(init)

				const { classNames, props } = expression

				return {
					$$typeof,
					key: null,
					props: {
						...props,
						className: classNames.concat(classNameOverrides).filter(Boolean).join(' '),
					},
					ref,
					type: as || type,
					_owner: null,
				}
			},
			rule,
			{
				displayName: 'Styled' + displayType,
			},
		)
	}

	return core
}

export default reactFactory
