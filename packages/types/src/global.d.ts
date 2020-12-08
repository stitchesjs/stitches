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
	flush(): void
	global(init?: RuleStyles): GlobalRule
	theme(init: Theme, isRoot?: boolean): GlobalRule
	toString(): string
	conditions: Conditions
	css: this
	cssText: string
	globalRules: Set<GlobalRule | ThemeRule>
	prefix: string
	properties: FunctionalProperties
	rules: Set<StyledRule>
	theme: Theme
}

declare type StyledSheetInit = Partial<StyledSheetOpts> | StyledRule

declare interface StyledSheetOpts extends RuleStyles {
	variants: StitchesVariantStyles
}

/* StyledRule
/* ========================================================================== */

declare interface StyledRule {
	(init?: StyledRuleInit): StyledExpression
	toString(): string
	className: string
	cssText: string
	selector: string
	sheet: StyledSheet
	styles: RuleStyles
	variants: StitchesVariantStyles
}

declare type StyledRuleInit = Partial<StyledRuleOpts>

declare type StyledRuleOpts = {
	[variationName in number | string]: number | string | StyledExpressionConditionals
}

declare type StyledExpressionConditionals = {
	[conditionName in string]: boolean | number | string
}

/* GlabalRule
/* ========================================================================== */

declare interface GlobalRule {
	(): void
	toString(): string
	cssText: string
	sheet: StyledSheet
	styles: RuleStyles
}

declare type GlobalRuleInit = Partial<GlobalRuleOpts>

declare type GlobalRuleOpts = {
	[variationName in number | string]: number | string | GlobalExpressionConditionals
}

declare type GlobalExpressionConditionals = {
	[conditionName in string]: boolean | number | string
}

declare interface StyledExpression {
	toString(): string
	className: string
	rule: StyledRule
	selector: string
}

declare type RuleStyles = {
	[propertyOrSelector in string]: string | number | RuleStyles
}

declare type StitchesVariantStyles = {
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
