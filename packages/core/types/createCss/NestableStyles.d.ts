import { Config } from '../createCss'
import { CSSProperties } from '../css/CSSProperties'
import { DefaultThemeMap } from '../default/DefaultThemeMap'
import { Narrow, PlainObject, Primitive, Try } from '../utility'

export type NestableStyles<
	C extends Config = Config,
	T extends PlainObject = {}
> = (
	keyof T extends string
		? (
			| (
				// CSS Declarations
				| {
					[K in keyof CSSProperties<C, T>]: CSSProperties<C, T>[K]
				}
				// CSS Nested Media Rules
				| {
					[K in `@${keyof C['media']}`]: /** Nested styles. */ NestableStyles<C, T[K]>
				}
				// CSS Nested Rules
				| {
					[K in string]: (
						T[K] extends Primitive
							? T[K]
						: /** Nested styles. */ NestableStyles<C, T[K]>
					)
				}
			)
			// Additional Values
			| {
				[K in keyof T]: unknown
			}
		)
	: never
) // prettier-ignore
