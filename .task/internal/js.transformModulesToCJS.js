import * as js from './js.js'

export let transformModulesToCJS = (ast) => {
	// replace exports
	ast.find('ExportNamedDeclaration', (exportNamedDeclaration) => {
		let expressionStatement = js.ExpressionStatement({
			expression: js.AssignmentExpression({
				left: js.MemberExpression({
					object: js.Identifier({ name: 'module' }),
					property: js.Identifier({ name: 'exports' })
				}),
				right: js.ObjectExpression({
					properties: [],
				}),
			})
		})

		exportNamedDeclaration.find('ExportSpecifier', (exportSpecifier) => {
			expressionStatement.expression.right.properties.push(
				js.create('Property', {
					key: js.create('Identifier', { name: exportSpecifier.exported.name }),
					value: js.create('Identifier', { name: exportSpecifier.local.name }),
				})
			)
		})

		exportNamedDeclaration.replaceWith(expressionStatement)
	})

	// replace imports
	ast.find('ImportDeclaration', (importDeclaration) => {
		let variableDeclaration = js.VariableDeclaration({
			declarations: [
				js.VariableDeclarator({
					id: js.Identifier({ name: importDeclaration.specifiers[0].local.name }),
					init: js.CallExpression({
						callee: js.Identifier({ name: 'require' }),
						arguments: [
							importDeclaration.source,
						],
					}),
				})
			]
		})

		importDeclaration.replaceWith(variableDeclaration)
	})

	return ast
}
