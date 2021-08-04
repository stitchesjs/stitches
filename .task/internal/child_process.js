import cp from 'child_process'
import { rootUrl } from './dirs.js'

export * from 'child_process'

export const spawn = (
	/** @type {string} */ exec,
	/** @type {readonly string[]} */ args = [],
	/** @type {cp.SpawnOptionsWithoutStdio} */ opts = {}
) => new Promise(
	(close, error) => {
		cp.spawn(exec, [].concat(args || []), {
			cwd: rootUrl.pathname,
			env: { ...process.env },
			stdio: 'inherit',
			...Object(opts)
		})._events = { close, error }
	}
)
