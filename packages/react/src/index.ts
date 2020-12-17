import createCore from '@stitches/core'

const reactFactory = (init?: StyledSheetFactoryInit) => create(init)

const create = (init: StyledSheetFactoryInit | undefined) => {
	const core = createCore(init)
	const $$typeof = Symbol.for('react.element')

	core.styled = (type: string | object, init: anyobject) => {
		if ('$$typeof' in Object(type)) {
			// ...
		}

		const rule = core.css(init)
		const displayType = typeof type === 'string' ? type : 'Component'

		return Object.assign(
			({ as, className: classNameOverride, ref = null, ...init }: anyobject) => {
				const classNameOverrides = String(classNameOverride || '').split(/\s+/)

				const { classNames, props } = rule(init)

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

// /** Factory that returns a StyledSheet. */
// function createStyled(init?: StyledSheetFactoryInit & { onUpdate(sheet: StyledSheet): void }) {
// 	const sheet = createCss(init)
// 	const { onUpdate } = Object(init)

// 	return define(sheet, {
// 		styled(type: string | object, init: anyobject) {
// 			const createExpression = sheet.css(init)

// 			return function Component({ as, className: classNameOverride, ref = null, ...props }: object & any) {
// 				const classNameOverrides = String(classNameOverride || '')
// 					.split(/\s+/)
// 					.filter(Boolean)

// 				const expression = createExpression(props)

// 				props.className = [...expression.classNames, ...classNameOverrides].join(' ')

// 				if (typeof onUpdate === 'function') {
// 					onUpdate(sheet)
// 				}

// 				/** @todo add `css` prop */

// 				return {
// 					$$typeof: Symbol.for('react.element'),
// 					key: null,
// 					props,
// 					ref,
// 					type: as || type,
// 					_owner: null,
// 				}
// 			}
// 		},
// 	})
// }

// export default createStyled
