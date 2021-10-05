// https://github.com/modulz/stitches/issues/813
import { createStitches } from '@stitches/react'
import * as Stitches from '@stitches/react'

const { config, styled } = createStitches({
	theme: {
		colors: {
			primary: 'transparent'
		}
	},
	utils: {
		bg: (value: Stitches.PropertyValue<'backgroundColor'>) => ({
			color: value
		}), 
		c: (value: Stitches.ScaleValue<'colors'>) => ({
			color: value
		})
	}
})

// ensure `PropertyValue` accepts a valid CSS Color
export const colorValue1: Stitches.PropertyValue<'backgroundColor', typeof config> = "RebeccaPurple"
// ensure `PropertyValue` accepts a valid token
export const colorValue2: Stitches.PropertyValue<'backgroundColor', typeof config> = "$primary"

// ensure `ScaleValue` accepts a valid token
export const colorToken: Stitches.ScaleValue<'colors', typeof config> = '$primary'

export const Box = styled('div', { 
	// ensure `bg` accepts a valid CSS Color
	bg: 'RebeccaPurple',
	// ensure `bg` accepts a valid token
	'&': { bg: '$primary' },
	// ensure `c` accepts a valid token
	c: '$primary',
})