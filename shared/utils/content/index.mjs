const matchUnquoted = /^([^]*["'][^]*|[A-Za-z]+\([^]*|[^]*-quote|inherit|initial|none|normal|revert|unset)$/

const content = {
	content: () => (d) => (!matchUnquoted.test(d) ? { content: `"${d}"` } : undefined),
}

export default content
