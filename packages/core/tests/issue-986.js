import { toTokenizedValue } from '../src/convert/toTokenizedValue.js'

describe('Issue #986', () => {
	const sampleURL = 'https://example.com/images/some-url-string-1--Version-6.jpg'

	test('url only', () => {
		const tokenizedUrlOnly = toTokenizedValue(`url(${sampleURL})`, '', '')
		expect(tokenizedUrlOnly).toBe(`url(${sampleURL})`)
	})
	
	test('url with additional properties before or after', () => {
		const tokenizedConstantSuffix = toTokenizedValue(`url(${sampleURL}) fixed`, '', '')
		expect(tokenizedConstantSuffix).toBe(`url(${sampleURL}) fixed`)

		const tokenizedConstantPrefix = toTokenizedValue(`repeat url(${sampleURL})`, '', '')
		expect(tokenizedConstantPrefix).toBe(`repeat url(${sampleURL})`)

		const tokenizedVariableSuffix = toTokenizedValue(`url(${sampleURL}) -1--Version-6`, '', '')
		expect(tokenizedVariableSuffix).toBe(`url(${sampleURL}) calc(var(--Version-6)*-1)`)

		const tokenizedVariablePrefix = toTokenizedValue(`-1--Version-6 url(${sampleURL})`, '', '')
		expect(tokenizedVariablePrefix).toBe(`calc(var(--Version-6)*-1) url(${sampleURL})`)
	})

	test('url with additional properties both before and after', () => {
		const tokenizedConstantPrePostfix = toTokenizedValue(`repeat url(${sampleURL}) fixed`, '', '')
		expect(tokenizedConstantPrePostfix).toBe(`repeat url(${sampleURL}) fixed`)

		const tokenizedVariablePrePostfix = toTokenizedValue(`-1--Version-6 url(${sampleURL}) -1--Version-7`, '', '')
		expect(tokenizedVariablePrePostfix).toBe(`calc(var(--Version-6)*-1) url(${sampleURL}) calc(var(--Version-7)*-1)`)

	})
})
