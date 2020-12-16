import { Properties } from './css-types'
import { cssPropToTokenMap } from './cssPropToTokenMap'

// prettier-ignore
export type EmptyTheme = {
	colors?: {}
	space?: {}
	fontSizes?: {}
	fonts?: {}
	fontWeights?: {}
	lineHeights?: {}
	letterSpacings?: {}
	sizes?: {}
	borderWidths?: {}
	borderStyles?: {}
	radii?: {}
	shadows?: {}
	zIndices?: {}
	transitions?: {}
}

export type CSSPropertiesToTokenScale = typeof cssPropToTokenMap

// prettier-ignore
export type StitchesCSS<
  Conditions = {},
  Theme = {},
  Utils = {},
  AllowNesting = true
> = { [k in keyof Properties]?: CSSPropertiesToTokenScale[k] extends keyof Theme ?  keyof Theme[CSSPropertiesToTokenScale[k]] | Properties[k] : Properties[k]}
  & { [k in `when$${keyof Conditions}`]?: StitchesCSS<Conditions, Theme, Utils, AllowNesting>; }
  & { [k in keyof Utils]?: Utils[k] }
  & { [k in string]?: AllowNesting extends true ? StitchesCSS<Conditions, Theme, Utils, AllowNesting> | string | number : {} }

export interface TCss<A = {}, B = {}, C = {}> {
	<Vars = { [i: number]: { [k: string]: { [b: string]: StitchesCSS<A, B, C> } } }>(
		...styles: {
			[i in keyof Vars]: {
				variants?: { [k in keyof Vars[i]]: { [v in keyof Vars[i][k]]: StitchesCSS<A, B, C> } }
			} & StitchesCSS<A, B, C>
		}
	): { bla: Vars }
	global: (definition: Record<string, StitchesCSS<A, B, C, D>>) => GlobalRule
	theme: (
		theme: Partial<
			{
				[TO in keyof B]: Partial<B[TO]>
			}
		>,
	) => ThemeRule
}

interface IConfig<Conditions, Theme, Utils, Prefix> {
	conditions?: { [k in keyof Conditions]?: Conditions[k] }
	theme?: { [k in keyof Theme]: k extends keyof EmptyTheme ? Theme[k] : never } & { [k in keyof EmptyTheme]?: Theme[k] }
	properties?: {
		[k in keyof Utils]: (a: Utils[k]) => StitchesCSS<Conditions, Theme, Utils>
	}
	prefix?: Prefix
}

type CssFactory = <Conditions = {}, Theme = {}, Utils = {}, Prefix extends string = ''>(
	_config: IConfig<Conditions, Theme, Utils, Prefix>,
) => TCss<Conditions, Theme, Utils>

declare const createCss: CssFactory

export default createCss
