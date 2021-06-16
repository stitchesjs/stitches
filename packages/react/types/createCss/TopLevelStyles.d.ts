import { Config } from '../createCss'
import { PlainObject, Primitive } from '../utility'

export type TopLevelStyles<
	C extends Config = Config,
	T extends PlainObject = PlainObject
> = (
	keyof T extends string ? (
		(
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
