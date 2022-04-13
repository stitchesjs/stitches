import { createStitches } from '../src/index.js'
import { createMemo } from '../src/utility/createMemo.js'

describe('Issue #832', () => {
	test('Circular object bug reproduction', () => {
		const circularObject = { }
		circularObject.self = circularObject

		expect(() => JSON.stringify(circularObject)).toThrow()
		expect(() => createMemo(circularObject)).toNotThrow()
		expect(() => createStitches(circularObject)).toNotThrow()
	})
})
