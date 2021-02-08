import Object, { assign, create } from '../src/Object.js'

describe('Object()', () => {
	const object = {}
	const string = 'A'
	const number = 0

	test('Object() preserves an existing object', async () => {
		expect(object).toBe(object)
		expect(Object(object)).toBe(object)
		expect(typeof object).toBe('object')
	})

	test('Object() converts a string into a kind of object', async () => {
		expect(string).toBe(string)
		expect(typeof string).toBe('string')
		expect(string.constructor).toBe(String)
		expect(string[0]).toBe('A')

		expect(Object(string)).not.toBe(string)
		expect(typeof Object(string)).toBe('object')
		expect(Object(string).constructor).toBe(String)
		expect(Object(string)[0]).toBe('A')

		expect(String(Object(string))).toBe(string)
	})

	test('Object() converts a number into a kind of object', async () => {
		expect(number).toBe(number)
		expect(typeof number).toBe('number')
		expect(number.constructor).toBe(Number)

		expect(Object(number)).not.toBe(number)
		expect(typeof Object(number)).toBe('object')
		expect(Object(number).constructor).toBe(Number)

		expect(Number(Object(number))).toBe(number)
	})
})

describe('create()', () => {
	test('create() creates a new kind of object', async () => {
		expect(create(null).constructor).toBe(undefined)
		expect(Object.getPrototypeOf(create(null))).toBe(null)

		expect(create(Object.prototype).constructor).toBe(Object)
		expect(Object.getPrototypeOf(create(Object.prototype))).toBe(Object.prototype)
	})
})

describe('assign()', () => {
	const object = {}

	test('assign() adds to an object', async () => {
		expect(Object.keys(object).length).toBe(0)

		expect(assign(object, { foo: true })).toBe(object)
		expect(object.foo).toBe(true)
		expect(Object.keys(object).length).toBe(1)

		expect(assign(object, { bar: true })).toBe(object)
		expect(object.bar).toBe(true)
		expect(Object.keys(object).length).toBe(2)
	})
})
