import React from 'react'
import { render } from 'react-dom'
import Home from './src/Home'
import sheet from './stitches.config'

function App(props: any & object) {
	const style = React.useMemo(() => document.head.appendChild(document.createElement('style')), [])

	React.useLayoutEffect(() => void Reflect.set(style, 'textContent', sheet))

	return props.children
}

render(
	<React.StrictMode>
		<App>
			<Home />
		</App>
	</React.StrictMode>,
	new Proxy(document.body, {
		get(target, propertyKey) {
			const value = Reflect.get(target, propertyKey)

			return typeof value === 'function' ? value.bind(target) : propertyKey === 'tagName' ? 'div' : value
		},
		set(target, propertyKey, value) {
			return Reflect.set(target, propertyKey, value)
		},
	}),
)
