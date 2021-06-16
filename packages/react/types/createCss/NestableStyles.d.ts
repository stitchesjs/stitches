import { CSSProperties } from '../css/CSSProperties'
import { Config } from '../createCss'
import { PlainObject, Primitive } from '../utility'
import { DefaultThemeMap } from '../default/DefaultThemeMap'

export type NestableStyles<
	C extends Config = Config,
	T extends PlainObject = PlainObject
> = (
	keyof T extends string ? (
		(
			// CSS Tokens
			| (
				C['themeMap'] extends PlainObject ? {
					[K in keyof C['themeMap']]: `$${keyof C['theme'][C['themeMap'][K]]}`
				} : {
					[K in keyof DefaultThemeMap]: `$${keyof C['theme'][DefaultThemeMap[K]]}`
				}
			)
			// CSS Declarations
			| {
				[K in keyof CSSProperties<C, T>]: CSSProperties<C, T>[K]
			}
			// CSS Nested Media Rules
			| {
				[K in `@${keyof C['media']}`]: NestableStyles<C, T[K]>
			}
			// CSS Nested Rules
			| {
				[K in string]: (
					T[K] extends Primitive
						? T[K]
					: NestableStyles<C, T[K]>
				)
			}
			// Additional Values
			| {
				[K in keyof T]: unknown
			}
		)
	) : never
) // prettier-ignore
