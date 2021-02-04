import Object, { assign } from '../../core/src/Object.js'
import createCoreCss from '../../core/src/index.js'

export default assign((init) => {
	const hasDocument = typeof document === 'object'

	const importText = hasDocument && new Text('')
	const globalText = hasDocument && new Text('')
	const themedText = hasDocument && new Text('')
	const styledText = hasDocument && new Text('')

	const createOnChange = hasDocument ? (textNode, type) => Reflect.set.bind(Reflect, textNode, 'data') : () => undefined

	let sheetParent
	let sheetTarget

	const assignElement = hasDocument ? (element, props, ...nodes) => {
		const node = typeof element === 'string' ? document.createElement(element) : element;

		for (const name in props) {
			if (name in node) {
				node[name] = props[name];
			} else if (props[name] === null) {
				node.removeAttribute(name);
			} else {
				node.setAttribute(name, props[name]);
			}
		}

		node.append(...nodes);

		return node;
	} : () => ''

	const createFragment = hasDocument ? ((...nodes) => assignElement(new DocumentFragment, null, ...nodes)) : () => ''

	init = assign(
		{
			classProp: 'class',
			onImport: createOnChange(importText, 'import'),
			onGlobal: createOnChange(globalText, 'global'),
			onThemed: createOnChange(themedText, 'themed'),
			onStyled: createOnChange(styledText, 'styled'),
			onResets() {
				if (hasDocument) {
					this.sync()

					sheetTarget.textContent = importText.data = globalText.data = themedText.data = styledText.data = ''
					sheetTarget.append(importText, globalText, themedText, styledText)
				}
			}
		},
		init,
	)

	const stitches = assign(createCoreCss(init), {
		sync() {
			if (hasDocument) {
				if (!sheetParent) sheetParent = document.head || document.documentElement
				if (!sheetTarget) sheetTarget = document.getElementById('stitches') || assign(document.createElement('style'), { id: 'stitches' })
				if (!sheetTarget.parentNode) sheetParent.prepend(sheetTarget)
			}
		},
		styled: new Proxy(
			(
				/** Type of component element. */
				asType = 'span',
				/** Styles representing component CSS. */
				initStyles,
			) => {
				const expressStyledRule = stitches.css(asType, initStyles)

				return Object.setPrototypeOf(assign((
					/** Props used to determine the expression of the current styled rule. */
					initProps,
					...nodes
				) => {
					const {
						props: { as: type = asType, ...props },
						toString,
					} = expressStyledRule(initProps)

					stitches.sync()

					return assign(assignElement(type, props, ...nodes), { toString })
				}, expressStyledRule, {
					of(...nodes) {
						return Reflect.apply(this, this, [{}, ...nodes])
					}
				}), Object(asType))
			},
			{
				get: (target, type) => (type in target ? (typeof target[type] === 'function' ? target[type].bind(target) : target[type]) : target.bind(null, type)),
			},
		),
		element: assignElement,
		fragment: createFragment,
	})

	return stitches.reset()
}, createCoreCss)
