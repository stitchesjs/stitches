export type DefaultThemeValue = {
	borderStyles: DefaultThemeScaleValue
	borderWidths: DefaultThemeScaleValue
	colors: DefaultThemeScaleValue
	fonts: DefaultThemeScaleValue
	fontSizes: DefaultThemeScaleValue
	fontWeights: DefaultThemeScaleValue
	letterSpacings: DefaultThemeScaleValue
	lineHeights: DefaultThemeScaleValue
	radii: DefaultThemeScaleValue
	shadows: DefaultThemeScaleValue
	sizes: DefaultThemeScaleValue
	space: DefaultThemeScaleValue
	transitions: DefaultThemeScaleValue
	zIndices: DefaultThemeScaleValue
}

export type DefaultThemeScaleValue = {
	[token: string]: string
}
