import { createStitches, PropertyValue, CSS } from '../types/index'

const config = {
	utils: {
		background: (value: boolean | PropertyValue<'background'>) => {
			if (typeof value === 'boolean') {
				return value ? {
					background: 'red'
				} : {}
			} else {
				return {
					background: value
				}
			}
		}
	},
}

const { css, globalCss } = createStitches(config)

globalCss({
	html: {
		background: true
	},
	body: {
		background: 'green'
	},
})

const Component = css({
	background: true,
	'> *': {
		background: 'green'
	}
})

Component({
	background: 'green',
	'> *': {
		background: true
	}
})

css(Component, {
	background: 'green'
})

css(Component, {
	background: true
})

const style: CSS = {
	background: true // expect error
}

const style2: CSS<typeof config> = {
	background: true
}

const style3: CSS<typeof config> = {
	background: 'green'
}
