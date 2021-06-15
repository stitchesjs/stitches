/** CSS styles. */
export type Styling = {
	[prelude: string]: number | string | Styling
}

/* ========================================================================== */

export type Config = {
	prefix: string
	media: {
		[name: string]: string
	}
}

/* ========================================================================== */
