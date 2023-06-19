// https://github.com/debitoor/safe-json-stringify/blob/master/index.js
import { hasOwn } from './hasOwn.js'

function throwsMessage(err) {
	return '[Throws: ' + (err ? err.message : '?') + ']'
}

function safeGetValueFromPropertyOnObject(obj, property) {
	if (hasOwn(obj, property)) {
		try {
			return obj[property]
		} catch (error) {
			return throwsMessage(error)
		}
	}
	return obj[property]
}

function ensureProperties(obj) {
	const seen = [] // store references to objects we have seen before

	function visit(obj) {
		if (obj === null || typeof obj !== 'object') {
			return obj
		}

		if (seen.indexOf(obj) !== -1) {
			return '[Circular]'
		}

		seen.push(obj)

		if (typeof obj.toJSON === 'function') {
			try {
				const result = visit(obj.toJSON())
				seen.pop()
				return result
			} catch(err) {
				return throwsMessage(err)
			}
		}

		if (Array.isArray(obj)) {
			const result = obj.map(visit)
			seen.pop()
			return result
		}

		const result = Object.keys(obj).reduce(function(acc, prop) {
			// prevent faulty defined getter properties
			acc[prop] = visit(safeGetValueFromPropertyOnObject(obj, prop))
			return acc
		}, {})
		seen.pop()
		return result
	}

	return visit(obj)
}

export const safeJsonStringify = (data, replacer, space) => {
	return JSON.stringify(ensureProperties(data), replacer, space)
}
