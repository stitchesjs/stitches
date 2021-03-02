import { toPrimitive } from './Symbol.js'

export const { assign, create, defineProperties, getOwnPropertyDescriptors } = Object

export const createComponent = (base, prop, props) =>
	assign(defineProperties(base, getOwnPropertyDescriptors(props)), {
		[toPrimitive]() {
			return base[prop]
		},
		toString() {
			return base[prop]
		},
	})
