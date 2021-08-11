/** CSS styles. */
export type Styling = {
	[prelude: string]: number | string | Styling
}

/* ========================================================================== */

/** Composer as it has been authored. */
export type InitComposer = {
	variants?: {
		[name: string]: {
			[value: string]: Styling
		}
	}

	compoundVariants?: {
		css: Styling
	} & {
		[name: string]: boolean | number | string | undefined
	}

	defaultVariants?: {
		[name: string]: string
	}
} & Styling

/** Composer as it has been processed. */
export type Internals = {
	/** Component type. */
	type: any
	/** Component composers. */
	composers: Set<Composer>
}

/** Composer as it has been processed. */
export type Composer = [
	/** Composer base class name. */
	string,

	/** Composer base styles. */
	Styling,

	/** Composer variants. */
	VariantTuple[],

	/** Composer compound variants. */
	VariantTuple[],

	/** Composer dynamic variants. */
	VariantTuple[],

	/** Composer variants pairings with any default variants applied. */
	PrefilledVariants,

	/** Composer undefined variants. */
	UndefinedVariants,
]

/* ========================================================================== */

/** Variant key/pair values that must match for the variant to be applied. */
export type VariantMatcher = {
	[name: string]: string
}

export type VariantTuple = [
	VariantMatcher,
	Styling,
	/** Whether the variant styles are empty. */
	boolean,
]

export type VariantProps = {
	[name: string]: string | { [breakpoint: string]: string }
}

/* ========================================================================== */

export type PrefilledVariants = {
	[name: string]: string
}

export type UndefinedVariants = string[]

/* ========================================================================== */

export type Render = (
	props: {
		children: {}[]
		css: Styling
	} & {
		[name: string]: any
	},
) => unknown

/* ========================================================================== */

export type Config = {
	prefix: string
	media: {
		[name: string]: string
	}
}

/* ========================================================================== */
