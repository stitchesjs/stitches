import { generate } from 'astring'
import { importAssertions } from 'acorn-import-assertions'
import { Node, Parser } from 'acorn'
import acornClassFields from 'acorn-class-fields'
import acornJsx from 'acorn-jsx'
import acornLogicalAssignment from 'acorn-logical-assignment'
import acornPrivateMethods from 'acorn-private-methods'

let acornPlugins = [
	acornJsx({ allowNamespaces: true, allowNamespacedObjects: true }),
	acornClassFields,
	acornLogicalAssignment,
	acornPrivateMethods,
	importAssertions
]

let prototype = Node.prototype
let parser = Parser.extend(...acornPlugins)

export let parse = (code) => {
	let parsed = parser.parse(code, { sourceType: 'module', ecmaVersion: 'latest' })

	return parsed
}

export let stringify = (ast) => generate(ast)

let defaultProps = {
	ArrowFunctionExpression: {
		expression: false,
		generator: false,
		async: false,
		params: [],
		body: null,
	},
	AssignmentExpression: {
		operator: '=',
		left: null,
		right: null,
	},
	BlockStatement: {
		body: [],
	},
	CallExpression: {
		callee: null,
		arguments: [],
		optional: false,
	},
	CatchClause: {
		param: null,
		body: { type: 'BlockStatement', body: [] }
	},
	ExportNamedDeclaration: {
		declaration: null,
		specifiers: []
	},
	ExportSpecifier: {
		local: null,
		exported: null,
	},
	ExpressionStatement: {
		expression: {
			operator: '=',
			left: null,
			right: null,
		},
	},
	Identifier: { name: '_' },
	ImportDefaultSpecifier: {
		local: null
	},
	ImportDeclaration: {
		specifiers: [],
		source: null,
	},
	Literal: {
		value: '_',
		raw: '\'_\'',
		optional: false,
	},
	MemberExpression: {
		object: null,
		property: null,
		computed: false,
		optional: false,
	},
	ObjectExpression: {
		properties: [],
	},
	ObjectPattern: {
		properties: [],
	},
	Program: {
		body: [],
	},
	Property: {
		method: false,
		shorthand: false,
		computed: false,
		key: null,
		value: null,
		kind: 'init',
	},
	RestElement: {
		argument: null,
	},
	ReturnStatement: {
		argument: null,
	},
	TryStatement: {
		block: null,
		handler: null,
		finalizer: null,
	},
	VariableDeclaration: {
		declarations: [],
		kind: 'var',
	},
	VariableDeclarator: {
		id: null,
		init: {
			type: 'CallExpression',
			callee: null,
			arguments: [],
		}
	},
}


let createNode = (...props) => Object.assign(Object.create(prototype), ...props)

export let create = (type, props) => createNode({ type }, defaultProps[type], props)

export let ArrowFunctionExpression = (props) => create('ArrowFunctionExpression', props)
export let AssignmentExpression = (props) => create('AssignmentExpression', props)
export let BlockStatement = (props) => create('BlockStatement', props)
export let CallExpression = (props) => create('CallExpression', props)
export let CatchClause = (props) => create('CatchClause', props)
export let ExportNamedDeclaration = (props) => create('ExportNamedDeclaration', props)
export let ExportSpecifier = (props) => create('ExportSpecifierExportSpecifier', props)
export let ExpressionStatement = (props) => create('ExpressionStatement', props)
export let Identifier = (props) => create('Identifier', props)
export let ImportDeclaration = (props) => create('ImportDeclaration', props)
export let ImportDefaultSpecifier = (props) => create('ImportDefaultSpecifier', props)
export let Literal = (props) => create('Literal', props)
export let MemberExpression = (props) => create('MemberExpression', props)
export let ObjectExpression = (props) => create('ObjectExpression', props)
export let Program = (props) => create('Program', props)
export let Property = (props) => create('Property', props)
export let ReturnStatement = (props) => create('ReturnStatement', props)
export let TryStatement = (props) => create('TryStatement', props)
export let VariableDeclaration = (props) => create('VariableDeclaration', props)
export let VariableDeclarator = (props) => create('VariableDeclarator', props)

export let parents = new WeakMap()

let createPrototypeOf = (value) => value == null ? value : Array.isArray(value) ? [] : Object.create(Object.getPrototypeOf(value))

Object.defineProperties(prototype, {
	clone: {
		value: {
			clone(overrides) {
				let process = (object) => {
					let clone = createPrototypeOf(object)

					for (let name of Object.keys(object)) {
						if (object[name] instanceof Object) {
							clone[name] = process(object[name])

							parents.set(clone[name], [name, clone])
						} else {
							clone[name] = object[name]
						}
					}

					return clone
				}

				return Object.assign(process(this), overrides)
			}
		}.clone,
		configurable: true,
		writable: true,
	},
	find: {
		value: {
			find(type, call) {
				let find = (object) => {
					if (object.type === type) call(object)

					for (let name of Object.keys(object)) {
						if (object[name] instanceof Object) {
							parents.set(object[name], [name, object])

							find(object[name])
						}
					}
				}

				find(this)
			}
		}.find,
		configurable: true,
		writable: true,
	},
	parent: {
		get: {
			parent() {
				return (parents.get(this) || [])[1] || null
			},
		}.parent,
		configurable: true,
	},
	parentNode: {
		get: {
			parentNode() {
				let object = this
				while (true) {
					object = parentOf(object)
					if (object == null) return null
					if (object instanceof Array) continue
					return object
				}
			},
		}.parentNode,
		configurable: true,
	},
	keyOfParent: {
		get: {
			keyOfParent() {
				return (parents.get(this) || [])[0] || null
			}
		}.keyOfParent,
		configurable: true,
	},
	keyOfParentNode: {
		get: {
			keyOfParentNode() {
				let object = this, key
				while (true) {
					key = keyOfParent(object)
					object = parentOf(object)
					if (object == null) return null
					if (Array.isArray(object)) continue
					return key
				}
			},
		}.keyOfParentNode,
		configurable: true,
	},
	remove: {
		value: {
			remove() {
				return this.replaceWith()
			}
		}.remove,
		configurable: true,
		writable: true,
	},
	replaceWith: {
		value: {
			replaceWith(...nodes) {
				let [name, node] = parents.get(this) || []
				if (!node) return

				if (Array.isArray(node)) {
					node.splice(name, 1, ...nodes)
				} else {
					node[name] = Array.isArray(node[name]) || nodes.length > 1 ? nodes : nodes[0] || null
				}
			}
		}.replaceWith,
		configurable: true,
		writable: true,
	},
	toString: {
		value: {
			toString() {
				return stringify(this)
			},
		}.toString,
		configurable: true,
		writable: true,
	},
})

export let keyOfParent = (object) => (parents.get(object) || [])[0] || null
export let parentOf = (object) => (parents.get(object) || [])[1] || null

export let find = (node, type, next) => {
	if (node.type === type) {
		if (next) next(node)
		else return node
	}
	for (let name in node) {
		if (name === 'type') continue

		let data = node[name]

		if (Array.isArray(data)) {
			parents.set(data, this)

			for (let each of data) {
				if (each instanceof Node) {
					parents.set(each, data)

					let deep = find(each, type, next)

					if (deep && !next) return deep
				}
			}
		} else if (data instanceof Node) {
			parents.set(data, this)

			let deep = find(data, type, next)

			if (deep && !next) return deep
		}
	}
	return null
}
