import * as js from './js.js'

export let transformIIFE = (ast) => {
	ast.body = [
		js.ExpressionStatement({
			expression: js.AssignmentExpression({
				left: js.Identifier({ name: 'stitches' }),
				right: js.CallExpression({
					callee: js.ArrowFunctionExpression({
						body: js.BlockStatement({
							body: ast.body
						})
					})
				})
			})
		})
	]

	// remove imports
	ast.find('ImportDeclaration', (importDeclaration) => {
		importDeclaration.remove()
	})

	// change exports to returns
	ast.find('ExportNamedDeclaration', (exportNamedDeclaration) => {
		exportNamedDeclaration.replaceWith(
			js.ReturnStatement({
				argument: js.ObjectExpression({
					properties: exportNamedDeclaration.specifiers.map(
						(exportSpecifier) => js.Property({
							key: exportSpecifier.exported,
							value: exportSpecifier.local,
						})
					)
				})
			})
		)
	})

	return ast
}
