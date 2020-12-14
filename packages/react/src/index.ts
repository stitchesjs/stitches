import createCss from '@stitches/core'
import define from './lib/define'

/** Factory that returns a StyledSheet. */
const createStyled: StyledSheetFactory = function createStyled(init?: StyledSheetFactoryInit) {
	const sheet = createCss(init)

	return define(sheet, {
		styled(name: string | any, init: object) {
			const type = name === Object(name).type ? name.type : name
			const rule = sheet.css(init)

			return function Component({ className, ref = null, ...props }: object & any) {
				const classList = new Set(rule.classList)
				if (className) classList.add(className)
				for (const prop in props) {
					if (prop in rule.variants) {
						delete props[prop]
					}
				}
				props.className = Array.from(classList).join(' ')
				return {
					$$typeof: Symbol.for('react.element'),
					key: null,
					props,
					ref,
					type,
					_owner: null,
				}
			}
		},
	})
}

export default createStyled
