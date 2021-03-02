import { deepEqual as toEqual, equal as toBe, notDeepEqual as toNotEqual, notEqual as toNotBe } from 'node:assert/strict'

export default function expect(actual) {
	return {
		/** Tests for deep equality between the actual and expected parameters. */
		toEqual: toEqual.bind(this, actual),
		/** Tests for strict equality between the actual and expected parameters. */
		toBe: toBe.bind(this, actual),
		toBeInstanceOf: toBeInstanceOf.bind(this, actual),
		toNotEqual: toNotEqual.bind(this, actual),
		toNotBe: toNotBe.bind(this, actual),
		toNotBeInstanceOf: toNotBeInstanceOf.bind(this, actual),
	}
}

function toBeInstanceOf(actual, expected) {
	if (!(actual instanceof expected)) {
		throw new AssertionError({
			message: `Expected value to be instance:`,
			operator: 'instanceOf',
			actual,
			expected,
		})
	}
}

function toNotBeInstanceOf(actual, expected) {
	if (actual instanceof expected) {
		throw new AssertionError({
			message: `Expected value to be instance:`,
			operator: 'instanceOf',
			actual,
			expected,
		})
	}
}
