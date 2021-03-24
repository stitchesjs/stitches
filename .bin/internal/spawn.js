import cp from 'child_process'
import { rootUrl } from './dirs.js'

export const spawn = async ({ exec = 'node', args = [], opts = {} }) =>
	await new Promise((close, error) => {
		opts = Object.assign(
			{
				cwd: rootUrl.pathname,
				env: { ...process.env },
				stdio: 'inherit',
			},
			opts,
		)

		cp.spawn(exec, args, opts)._events = { close, error }
	})
