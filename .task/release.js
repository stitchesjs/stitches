import URL from './internal/url.js'
import * as co from './internal/color.js'
import * as cp from './internal/child_process.js'
import * as fs from './internal/fs.js'
import * as rl from './internal/readline.js'

const main = async () => {
	const root = URL.from(import.meta.url).to('../')
	const pkg = await fs.readFileJson(root.to('package.json'), 'utf8')

	const state = {}

	const q1option = new Set(['major', 'minor', 'patch', 'prerelease'])

	state.release = await rl.question(`Release Type ${co.dim('(major, minor, patch, prerelease)')}:`)
	state.npmtag = state.release === 'prerelease' ? 'canary' : 'latest'

	if (!q1option.has(state.release)) return

	await cp.spawn('npm', ['version', state.release, '--workspaces'], { stdio: 'pipe' })

	const workspacepkgpaths = new Set
	const workspacetags = new Set

	for (let workspace of pkg.workspaces) {
		workspace = root.to(workspace).dir

		const workspacepkgpath = workspace.to('package.json')
		const workspacepkg = await fs.readFileJson(workspacepkgpath)

		state.version = `v${workspacepkg.version}`

		workspacepkgpaths.add(workspacepkgpath)
		workspacetags.add(`${workspacepkg.name}@${workspacepkg.version}`)
	}

	console.log(`Bumped ${co.bold(state.version)}`)

	const confirm = await rl.question(`Publish ${co.bold(state.version)} as ${co.bold(state.npmtag)} ${co.dim('(y/n)')}:`)

	if (confirm !== 'y') {
		for (const workspacepkgpath of workspacepkgpaths) {
			await cp.spawn('git', ['checkout', '--', workspacepkgpath.ospathname])
		}

		return
	}

	await cp.spawn('npm', ['run', 'build'], { stdio: 'ignore' })

	state.otp = await rl.question(`OTP:`)

	if (!state.otp) return

	for (const workspacepkgpath of workspacepkgpaths) {
		await cp.spawn('git', ['add', workspacepkgpath.ospathname])
	}

	await cp.spawn('git', ['commit', '-m', state.version])
	await cp.spawn('git', ['tag', state.version])
	await cp.spawn('git', ['push'])
	await cp.spawn('git', ['push', '--tags'])

	await cp.spawn('npm', ['publish', '--tag', state.npmtag, '--workspaces', '--otp', state.otp])
}

main()
