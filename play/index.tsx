import React from 'react'
import { render } from 'react-dom'
import Home from './src/Home'

render(
	<React.StrictMode>
		<Home />
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
