import createCss from '@stitches/core'
import define from './lib/define'

/** Factory that returns a StyledSheet. */
function createStyled(init?: StyledSheetFactoryInit & { onUpdate(sheet: StyledSheet): void }) {
	const sheet = createCss(init)
	const { onUpdate } = Object(init)

	return define(sheet, {
		styled(type: string | object, init: any & object) {
			const createExpression = sheet.css(init)

			return function Component({ as, className: classNameOverride, ref = null, ...props }: object & any) {
				const classNameOverrides = String(classNameOverride || '')
					.split(/\s+/)
					.filter(Boolean)

				const expression = createExpression(props)

				props.className = [...expression.classNames, ...classNameOverrides].join(' ')

				if (typeof onUpdate === 'function') {
					onUpdate(sheet)
				}

				return {
					$$typeof: Symbol.for('react.element'),
					key: null,
					props,
					ref,
					type: as || type,
					_owner: null,
				}
			}
		},
	})
}

export default createStyled
