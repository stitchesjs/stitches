/* Object
/* ========================================================================== */

declare interface ObjectConstructor {
	<T>(value?: T): T extends anyobject ? T : T & anyobject
}

declare var Object: ObjectConstructor

/* Any Object
/* ========================================================================== */

declare type anyobject = any & object

/* Internals */
/* ========================================================================== */

type Conditions = { [condition: string]: string }

type Styles = { [name: string]: number | string | Styles } & { when: { [condition: string]: Styles } }

type Theme = { [scale: string]: { [token: string]: number | string } }

type ThemeMap = { [property: string]: string }

type Utils = { [name: string]: (value: any) => number | string | Styles }

type Variants = { [name: string]: { [value: string]: Styles } }

declare type StyleValue = number | string | Styles

declare type Styles = { [name: string]: StyleValue } & { when?: { [condition: string]: { [name: string]: StyleValue } } }
