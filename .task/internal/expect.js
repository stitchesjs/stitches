import { deepEqual as toEqual, equal as toBe, notDeepEqual as toNotEqual, notEqual as toNotBe } from 'node:assert/strict'

export default function expect(actual) {
	return {
		/** Tests for strict equality between the actual and expected parameters. */
		toBe: toBe.bind(this, actual),
		/** Tests that the actual object is an instance of the expected class. */
		toBeInstanceOf: toBeInstanceOf.bind(this, actual),
		/** Tests for deep equality between the actual and expected parameters. */
		toEqual: toEqual.bind(this, actual),
		/** Tests that the actual function does throw when it is called. */
		toThrow: toThrow.bind(this, actual),

		/** Tests for strict inequality between the actual and expected parameters. */
		toNotBe: toNotBe.bind(this, actual),
		/** Tests that the actual object is not an instance of the expected class. */
		toNotBeInstanceOf: toNotBeInstanceOf.bind(this, actual),
		/** Tests for deep inequality between the actual and expected parameters. */
		toNotEqual: toNotEqual.bind(this, actual),
		/** Tests that the actual function does not throw when it is called. */
		toNotThrow: toNotThrow.bind(this, actual),
	}
}

/** Tests that the actual object is an instance of the expected class. */
function toBeInstanceOf(actual, expected) {
	if (!(actual instanceof expected)) {
		throw new AssertionError({
			message: 'Expected value to be instance:',
			operator: 'instanceOf',
			actual,
			expected,
			stackStartFn: toBeInstanceOf,
		})
	}
}

/** Tests that the actual object is not an instance of the expected class. */
function toNotBeInstanceOf(actual, expected) {
	if (actual instanceof expected) {
		throw new AssertionError({
			message: 'Expected value to be instance:',
			operator: 'instanceOf',
			actual,
			expected,
			stackStartFn: toNotBeInstanceOf,
		})
	}
}

/** Tests that the actual function does throw when it is called. */
async function toThrow(actualFunction, expected) {
	let actual = undefined

	try {
		actual = await actualFunction()
	} catch (error) {
		// do nothing and continue
		return
	}

	throw new AssertionError({
		message: 'Expected exception:',
		operator: 'throws',
		stackStartFn: toThrow,
		actual,
		expected,
	})
}

/** Tests that the actual function does not throw when it is called. */
async function toNotThrow(actualFunction, expected) {
	let actual = undefined

	try {
		actual = await actualFunction()

		// do nothing and continue
		return
	} catch (error) {
		throw new AssertionError({
			message: 'Unexpected exception:',
			operator: 'doesNotThrow',
			stackStartFn: toThrow,
			actual,
			expected,
		})
	}
}
