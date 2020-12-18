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

	/** Clearas all CSS rules from the sheet.  */
	clear(): void

	/** Returns a new styled rule. */
	css(...inits: StyledRuleInit[]): StyledRule

	/** Generates CSS from global rules and returns a function which applies them to the sheet.  */
	global(init?: RuleStyles): GlobalRule

	/** Generates CSS from theme scales and returns a function which applies them to the sheet.  */
	theme(init: Theme): GlobalRule

	/** Returns all of the CSS applied to the sheet.  */
	toString(): string

	/** Conditions in which CSS would be applied. */
	conditions: Conditions

	/** Prefix applied to all styled and themed rules. */
	prefix: string

	/** Functional properties whose values can be expanded into other properties. */
	properties: FunctionalProperties

	/** Returns a new themed rule. */
	theme: Theme
}

declare type StyledSheetInit = Partial<StyledSheetOpts> | StyledRule

declare interface StyledSheetOpts extends RuleStyles {
	variants: VariantStyles
}

declare interface ReactStyledSheet extends StyledSheet {
	styled(type: string | anyobject, init: anyobject): ReactStyledRule
}

/* StyledRule
/* ========================================================================== */

declare interface StyledRule<Variants, Conditions> {
	(
		init?: { [k in keyof Variants]?: keyof Variants[k] | { [I in `when$${keyof Conditions}`]?: keyof Variants[k] } },
	): StyledExpression
	toString(): string
	className: string
	classNames: string[]
	selector: string
	variants: Variants
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
	(props: anyobject): unknown

	displayName: string
	rule: StyledRule
	type: string | function
}

/* GlobalRule
/* ========================================================================== */

declare interface GlobalRule {
	(): void
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
}

declare type ThemeRuleType<T extends anyobject> = Object<ThemeRule & T>

/* Any Object
/* ========================================================================== */

declare type anyobject = any & object
