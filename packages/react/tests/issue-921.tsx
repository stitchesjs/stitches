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

const { css, globalCss, styled } = createStitches(config)

globalCss({
	html: {
		background: true
	},
	body: {
		background: 'green'
	},
})

const CComponent = css({
	background: true,
	'> *': {
		background: 'green'
	}
})

CComponent({
	background: 'green',
	'> *': {
		background: true
	}
})

css(CComponent, {
	background: 'green'
})

css(CComponent, {
	background: true
})

const SComponent = styled('div', {
	background: 'green',
	'> *': {
		background: true
	}
})

void function Test() {
	return (
		<SComponent css={{
				background: true,
				'> *': {
					background: 'green'
				}
			}}
		/>
	)
}

const style: CSS = {
	// @ts-expect-error
	background: true 
}

const style2: CSS<typeof config> = {
	background: true
}

const style3: CSS<typeof config> = {
	background: 'green'
}
