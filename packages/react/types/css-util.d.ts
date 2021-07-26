import type * as CSS from './css'
import type * as Default from './default'
import type * as ThemeUtil from './theme'
import type * as Util from './util'

/** CSS style declaration object. */
export interface CSSProperties extends CSS.StandardLonghandProperties, CSS.StandardShorthandProperties, CSS.SvgProperties {}

type ValueByPropertyName<PropertyName> = PropertyName extends keyof CSSProperties ? CSSProperties[PropertyName] : never

type TokenByPropertyName<PropertyName, Theme, ThemeMap> = PropertyName extends keyof ThemeMap ? TokenByScaleName<ThemeMap[PropertyName], Theme> : never

type TokenByScaleName<ScaleName, Theme> = ScaleName extends keyof Theme ? Util.Prefixed<'$', keyof Theme[ScaleName]> : never

/** Returns a Style interface, leveraging the given media and style map. */
export type CSS<
	Media = Default.Media,
	Theme = {},
	ThemeMap = Default.ThemeMap,
	Utils = {}
> = (
	// nested at-rule css styles
	& {
		[K in Util.Prefixed<'@', keyof Media>]?: CSS<Media, Theme, ThemeMap, Utils>
	}
	// known property styles
	& {
		[K in keyof CSSProperties]?: (
			| ValueByPropertyName<K>
			| TokenByPropertyName<K, Theme, ThemeMap>
			| CSS.Globals
			| Util.Index
			| ThemeUtil.TokenInterface
		)
	}
	// known utility styles
	& {
		[K in keyof Utils]?: (
			K extends keyof CSSProperties
				? unknown
			: (
				| (
					Utils[K] extends (arg: infer P) => any
						? P extends any[]
							? (
								$$PropertyValue extends keyof P[0]
									? (
										| ValueByPropertyName<P[0][$$PropertyValue]>
										| TokenByPropertyName<P[0][$$PropertyValue], Theme, ThemeMap>
										| CSS.Globals
										| Util.Index
									)
								: $$ScaleValue extends keyof P[0]
									? (
										| TokenByScaleName<P[0][$$ScaleValue], Theme>
										| Util.Index
									)
								: never
							)[]
						: $$PropertyValue extends keyof P
							? (
								| ValueByPropertyName<P[$$PropertyValue]>
								| TokenByPropertyName<P[$$PropertyValue], Theme, ThemeMap>
								| CSS.Globals
								| Util.Index
							)
						: $$ScaleValue extends keyof P
							? (
								| TokenByScaleName<P[$$ScaleValue], Theme>
								| Util.Index
							)
						: never
					: never
				)
			)
		)
	}
	// known theme styles
	& {
		[K in keyof ThemeMap]?: (
			K extends keyof CSSProperties
				? unknown
			: K extends keyof CSSProperties
				? unknown
			: K extends keyof Utils
				? unknown
			: (
				| CSS.Globals
				| Util.Index
			)
		)
	}
	// unknown css declaration styles
	& {
		[K in string]: (
			K extends Util.Prefixed<'@', keyof Media>
				? unknown
			: K extends keyof CSSProperties
				? unknown
			: K extends keyof Utils
				? unknown
			: K extends keyof ThemeMap
				? unknown
			: K extends keyof { variants: unknown; defaultVariants: unknown; compoundVariants: unknown }
				? unknown
			: (
				| CSS<Media, Theme, ThemeMap, Utils>
				| CSS.Globals
				| Util.Index
				| any[]
			)
		)
	}
)


/** Returns a Style interface, leveraging the given media and style map. */
export type KnownCSS<
	Media = Default.Media,
	Theme = {},
	ThemeMap = Default.ThemeMap,
	Utils = {}
> = (
	// nested at-rule css styles
	& {
		[K in Util.Prefixed<'@', keyof Media>]?: KnownCSS<Media, Theme, ThemeMap, Utils>
	}
	// known property styles
	& {
		[K in keyof CSSProperties]?: (
			| ValueByPropertyName<K>
			| TokenByPropertyName<K, Theme, ThemeMap>
			| CSS.Globals
			| Util.Index
			| ThemeUtil.TokenInterface
		)
	}
	// known utility styles
	& {
		[K in keyof Utils]?: (
			K extends keyof CSSProperties
				? unknown
			: (
				| (
					Utils[K] extends (arg: infer P) => any
						? P extends any[]
							? (
								$$PropertyValue extends keyof P[0]
									? (
										| ValueByPropertyName<P[0][$$PropertyValue]>
										| TokenByPropertyName<P[0][$$PropertyValue], Theme, ThemeMap>
										| CSS.Globals
										| Util.Index
									)
								: $$ScaleValue extends keyof P[0]
									? (
										| TokenByScaleName<P[0][$$ScaleValue], Theme>
										| Util.Index
									)
								: never
							)[]
						: $$PropertyValue extends keyof P
							? (
								| ValueByPropertyName<P[$$PropertyValue]>
								| TokenByPropertyName<P[$$PropertyValue], Theme, ThemeMap>
								| CSS.Globals
								| Util.Index
							)
						: $$ScaleValue extends keyof P
							? (
								| TokenByScaleName<P[$$ScaleValue], Theme>
								| Util.Index
							)
						: never
					: never
				)
			)
		)
	}
	// known theme styles
	& {
		[K in keyof ThemeMap]?: (
			K extends keyof CSSProperties
				? unknown
			: K extends keyof CSSProperties
				? unknown
			: K extends keyof Utils
				? unknown
			: (
				| CSS.Globals
				| Util.Index
			)
		)
	}
)

/** Unique symbol used to reference a property value. */
export declare const $$PropertyValue: unique symbol

/** Unique symbol used to reference a property value. */
export type $$PropertyValue = typeof $$PropertyValue

/** Unique symbol used to reference a token value. */
export declare const $$ScaleValue: unique symbol

/** Unique symbol used to reference a token value. */
export type $$ScaleValue = typeof $$ScaleValue

export declare const $$ThemeValue: unique symbol

export type $$ThemeValue = typeof $$ThemeValue
