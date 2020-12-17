/* Object
/* ========================================================================== */

declare interface ObjectConstructor {
	<T>(value?: T): T extends anyobject ? T : T & anyobject
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

declare interface ReactStyledSheet extends StyledSheet {
	styled(type: string | object, init: anyobject): ReactStyledRule
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

declare interface ReactStyledRule extends StyledRule {
	(init?: StyledRuleInit): ReactStyledElement
}

declare interface ReactStyledElement {
	$$typeof: symbol
	key: null
	props: anyobject
	ref
	type: string | function
	_owner: null
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
	(): string
	toString(): string
	className: string
	classNames: string[]
	props: anyobject
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

declare type ThemeRuleType<T extends anyobject> = Object<ThemeRule & T>

/* Any Object
/* ========================================================================== */

declare type anyobject = any & object
