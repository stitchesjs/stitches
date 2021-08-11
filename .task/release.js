import URL from './internal/url.js'
import * as co from './internal/color.js'
import * as cp from './internal/child_process.js'
import * as fs from './internal/fs.js'
import * as rl from './internal/readline.js'

let main = async () => {
	let root = URL.from(import.meta.url).to('../')
	let pkg = await fs.readFileJson(root.to('package.json'), 'utf8')

	let q1option = new Set(['major', 'minor', 'patch', 'prerelease'])
	let q1answer = await rl.question(`Bump ${co.dim('(major, minor, patch, prerelease)')}:`)
	if (!q1option.has(q1answer)) return

	await cp.spawn('npm', ['version', q1answer, '--workspaces'], { stdio: 'pipe' })

	let workspacepkgpaths = new Set
	let workspacetags = new Set
	let version = ''

	for (let workspace of pkg.workspaces) {
		workspace = root.to(workspace).dir

		let workspacepkgpath = workspace.to('package.json')
		let workspacepkg = await fs.readFileJson(workspacepkgpath)

		version = `v${workspacepkg.version}`

		workspacepkgpaths.add(workspacepkgpath)
		workspacetags.add(`${workspacepkg.name}@${workspacepkg.version}`)
	}

	console.log(`Bumped ${co.bold(version)}`)

	let tag = q1answer === 'prerelease' ? 'canary' : 'latest'

	let q2option = new Set(['y'])
	let q2answer = await rl.question(`Publish ${co.bold(version)} as ${co.bold(tag)} ${co.dim('(y/n)')}:`)

	if (!q2option.has(q2answer)) {
		for (const workspacepkgpath of workspacepkgpaths) {
			await cp.spawn('git', ['checkout', '--', workspacepkgpath.ospathname])
		}
		return
	}

	await cp.spawn('npm', ['run', 'build'])

	let q3answer = await rl.question(`OTP:`)
	if (!q3answer) return

	for (const workspacepkgpath of workspacepkgpaths) {
		await cp.spawn('git', ['add', workspacepkgpath.ospathname])
	}

	await cp.spawn('git', ['commit', '-m', version])
	await cp.spawn('git', ['tag', version])
	await cp.spawn('git', ['push'])
	await cp.spawn('git', ['push', '--tags'])

	await cp.spawn('npm', ['publish', '--tag', tag, '--workspaces', '--otp', otp])
}

main()
