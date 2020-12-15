/* Object
/* ========================================================================== */

declare interface ObjectConstructor {
	<T>(value?: T): T extends object ? T : T & object
}

declare var Object: ObjectConstructor

/* Theme
/* ========================================================================== */

declare type Theme = {
	[scaleName in string]: {
		[tokenName in number | string]: number | string
	}
}

/* Conditions
/* ========================================================================== */

declare type Conditions = {
	[conditionName in number | string]: string
}

/* Functional Properties
/* ========================================================================== */

declare type FunctionalProperties = {
	[property in string]: (
		value: number | string,
	) => {
		[property in number | string]: number | string
	}
}

/* StyledSheet Factory
/* ========================================================================== */

declare interface StyledSheetFactory {
	(init?: StyledSheetFactoryInit): StyledSheet
}

declare type StyledSheetFactoryInit = Partial<StyledSheetFactoryOpts>

declare interface StyledSheetFactoryOpts {
	prefix: string
	theme: Theme
	conditions: Conditions
	properties: FunctionalProperties
}

/* StyledSheet
/* ========================================================================== */

declare interface StyledSheet {
	(...inits: StyledSheetInit[]): StyledRule
	clear(): void
	global(init?: RuleStyles): GlobalRule
	theme(init: Theme): GlobalRule
	toString(): string
	conditions: Conditions
	css: this
	prefix: string
	properties: FunctionalProperties
	theme: Theme
}

declare type StyledSheetInit = Partial<StyledSheetOpts> | StyledRule

declare interface StyledSheetOpts extends RuleStyles {
	variants: VariantStyles
}

/* StyledRule
/* ========================================================================== */

declare interface StyledRule {
	(init?: StyledRuleInit): StyledExpression
	toString(): string
	className: string
	classNames: string[]
	selector: string
	variants: {
		[VariantName in string]: {
			[VariantName in number | string]: string
		}
	}
}

declare type StyledRuleInit = Partial<StyledRuleOpts>

declare type StyledRuleOpts = RuleStyles & {
	variants: {
		[VariantName in string]: {
			[VariantPair in number | string]: RuleStyles
		}
	}
}

/* GlobalRule
/* ========================================================================== */

declare interface GlobalRule {
	(): string
	toString(): string
}

/* StyledExpression
/* ========================================================================== */

declare interface StyledExpression {
	toString(): string
	className: string
	classNames: string[]
	selector: string
}

/* RuleStyles
/* ========================================================================== */

declare type RuleStyles = {
	[propertyOrSelector in string]: string | number | RuleStyles
}

/* VariantStyles
/* ========================================================================== */

declare type VariantStyles = {
	[variantName in number | string]: {
		[variantPair in number | string]: RuleStyles
	}
}

/* ThemeRule
/* ========================================================================== */

declare interface ThemeRule {
	toString(): string

	className: string
	cssText: string
	root: string
	sheet: null | StyledSheet
}

declare type ThemeRuleType<T extends object> = Object<ThemeRule & T>
