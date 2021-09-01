const voidTags = new Set([
	'area',
	'base',
	'br',
	'col',
	'command',
	'embed',
	'hr',
	'img',
	'input',
	'keygen',
	'link',
	'meta',
	'param',
	'source',
	'track',
	'wbr',
])

function* _children(children) {
	for (let child of children) {
		if (typeof child === 'function') {
			yield child()
		} else if (typeof child === 'string') {
			yield child
		} else if (!child && child !== 0) {
			// do nothing and continue
		} else {
			yield child
		}
	}
}

function* _h(tag, attrs, children) {
	if (tag.toLowerCase() === '!doctype') {
		yield `<${tag} `
		if (attrs) {
			yield Object.keys(attrs).join(' ')
		}
		yield '>'
		return
	}
	yield `<${tag}`
	if (attrs) {
		for (let [key, value] of Object.entries(attrs)) {
			if (value === '')
				yield ` ${key}=''`
			else if (value == null || value === false)
				yield ''
			else if (value === true)
				yield ` ${key}`
			else
				yield ` ${key}='${value}'`
		}
	}
	yield '>'
	if (voidTags.has(tag)) {
		return
	}
	yield* _children(children)
	yield `</${tag}>`
}

async function h(tag, attrs, ...pChildren) {
	const children = await Promise.all(pChildren.flat(Infinity))

	if (typeof tag === 'function') {
		return tag(attrs, ...children)
	}

	return Array.from(_h(tag, attrs, children)).join('')
}

function Fragment(_, ...children) {
	return Array.from(_children(children)).join('')
}

export {
	Fragment,
	h
}
