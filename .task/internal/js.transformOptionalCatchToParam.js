import * as js from './js.js'

export let transformOptionalCatchToParam = (ast) => {
	// replace optional catch
	ast.find('CatchClause', (catchClause) => {
		if (catchClause.param === null) {
			catchClause.param = js.Identifier({ name: 'e' })
		}
	})

	return ast
}
