import * as js from './js.js'

export let transformDestructuring = (ast) => {
	// replace destructuring
	ast.find('ObjectPattern', (objectPattern) => {
		if (objectPattern.keyOfParentNode === 'params') {
			let { parentNode } = objectPattern

			if (
				parentNode.body.type !== 'BlockStatement'
			) {
				parentNode.body.replaceWith(
					js.BlockStatement({
						body: [
							js.ReturnStatement({
								argument: parentNode.body
							})
						]
					})
				)
			}

			let argName = `_arg${objectPattern.keyOfParent}`

			objectPattern.replaceWith(
				js.Identifier({ name: argName })
			)

			parentNode.body.body.unshift(
				js.VariableDeclaration({
					kind: 'let',
					declarations: [
						js.VariableDeclarator({
							id: objectPattern,
							init: js.Identifier({ name: argName }),
						})
					]
				})
			)
		}
	})

	return ast
}
