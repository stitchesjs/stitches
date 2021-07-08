export declare class Token<
	/** Token name. */
	NameType extends string = string,

	/** Token value. */
	ValueType extends string = string,

	/** Token scale. */
	ScaleType extends string | void = void,

	/** Token prefix. */
	PrefixType extends string | void = void,
> {
	new (name: NameType, value: ValueType, scale?: ScaleType, prefix?: PrefixType): this

	/** Name of the token. */
	token: NameType

	/** Value of the token. */
	value: ValueType

	/** Category of interface the token applies to. */
	scale: ScaleType extends string ? ScaleType : ''

	/** Prefix added before the serialized custom property. */
	prefix: PrefixType extends string ? PrefixType : ''

	/** Serialized custom property representing the token. */
	variable: `--${this['prefix'] extends '' ? '' : `${this['prefix']}-`}${this['scale'] extends '' ? '' : `${this['scale']}-`}${this['token']}`

	/** Serialized CSS var() representing the token. */
	computedValue: `var(${this['variable']})`

	/** Returns a serialized CSS var() representing the token. */
	toString(): this['computedValue']
} // prettier-ignore

export type Tokens<Type extends object = {}, PrefixType extends string = ''> = __TokensLiteral<__TokensCreated<Type, PrefixType>>

type __TokensCreated<Type extends object, PrefixType extends string> = {
	[KScaleType in keyof Type]: (
		Type[KScaleType] extends object
			? {
				[KTokenType in keyof Type[KScaleType]]: (
					Type[KScaleType][KTokenType] extends string
						? Token<string & KTokenType, string & Type[KScaleType][KTokenType], string & KScaleType, PrefixType>
					: never
				)
			}
		: {}
	)
} // prettier-ignore

type __TokensLiteral<T> = T extends {} ? {
	[K in keyof T]: T[K]
} : never // prettier-ignore