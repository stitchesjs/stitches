import { ESLint } from 'eslint'

async function lint() {
	const eslint = new ESLint()

	const results = await eslint.lintFiles(['packages/*/types/*.ts'])

	const formatter = await eslint.loadFormatter('stylish')
	const resultText = formatter.format(results)

	if (resultText) console.log(resultText)
	else console.log('\x1b[32m✔\x1b[0m', 'Your code is flawless.', 'Hopefully this determination is flawless, too.')
}

lint().catch((error) => {
	process.exitCode = 1
	console.error(error)
})
