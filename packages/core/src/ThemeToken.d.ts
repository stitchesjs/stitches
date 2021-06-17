import { Optional, Primitive, ToString, ToTailDashed } from './utility'

/** Theme Tokens represent named reusable values, which may be unique to a scale and prefixed. */
export declare class ThemeToken<T1 extends Primitive, T2 extends Primitive, T3 extends Optional, T4 extends Optional> {
	constructor(token: T1, value: T2, scale?: T3, prefix?: T4)

	/** Name of the token. */
	token: Primitive extends T1 ? '' : ToString<T1>

	/** Original value of the token. */
	value: Primitive extends T2 ? '' : `${T2}`

	/** Category of interface the token applies to. */
	scale: Optional extends T3 ? '' : `${T3}`

	/** Prefix added before the serialized custom property. */
	prefix: Optional extends T4 ? '' : `${T4}`

	/** Serialized custom property representing the token. */
	variable: `--${ToTailDashed<this['prefix']>}${ToTailDashed<this['scale']>}${this['token']}`

	/** Serialized CSS var() representing the token. */
	computedValue: `var(${this['variable']})`

	/** Returns a serialized CSS var() representing the token. */
	toString: this['computedValue']
}
