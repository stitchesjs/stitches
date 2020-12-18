import createCss from './index'

export const css = createCss({
	theme: {
		colors: {
			red100: 'red',
		},
		sizes: {
			s: 'wef',
		},
		space: {
			red: '213',
		},
	},
	conditions: {
		/**
		 * does cool things
		 */
		potato: 'hi',
	},
	properties: {
		/**
		 * This is a util with some really nice intellisense
		 */
		mx: (val: number) => {
			return {
				when$potato: {
				}
				backgroundColor: 'red',
			}
		},
		my: (val: number) => {
			return {
				color: 'red100',
			}
		},
	},
})
