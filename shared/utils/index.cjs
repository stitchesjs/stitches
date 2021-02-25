const content = require('./content/index.cjs')
const logicalProperties = require('./logical-properties/index.cjs')
const prefix = require('./prefixes/index.cjs')

const utils = {
	...content,
	...logicalProperties,
	...prefix,
}

export default utils
