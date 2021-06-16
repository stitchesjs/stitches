import { Config, ThemeInit } from '../createCss'

/* ========================================================================== */

/** Creates new global styles with the specified styles, and returns a new function to activate them. */
export type CreateTheme<C extends Config = Config> = <T extends {} = {}>(
	themeInit: ThemeInit<T>
) => ThemeExpressed<T, C> // prettier-ignore

/* ========================================================================== */

export type ThemeExpressed<T extends ThemeInit = ThemeInit, C extends Config = Config> = (
	{
		className: string
		selector: string
	} & {
		[Scale in keyof T]: {
			[Token in keyof T[Scale]]: ThemeToken<C['prefix'], Scale, Token, T[Scale][Token]>
		}
	}
) // prettier-ignore

/* ========================================================================== */

export type ThemeToken<
	Prefix extends string,
	Scale extends string,
	Token extends string,
	Value extends string
> = {
	computedValue: `var(-${Prefix extends '' ? '' : `-${Prefix}`}-${Scale}-${Token})`
	prefix: Prefix
	scale: Scale
	token: Token
	value: Value
	variable: `-${Prefix extends '' ? '' : `-${Prefix}`}-${Scale}-${Token}`
} // prettier-ignore
