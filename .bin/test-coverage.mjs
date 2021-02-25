import cp from 'child_process'
import fp from 'path'
import fs from './fs.mjs'
import os from 'os'
import { bold, dim, green, red } from './color.mjs'

// Creates a unique temporary directory
!(async () => {
	/** Directory storing code coverage. */
	const NODE_V8_COVERAGE = await fs.mkdtemp(os.tmpdir())

	/** Exit code from the covered NodeJS process. */
	await new Promise((close, error) => {
		cp.spawn('node', process.argv.slice(2), {
			stdio: 'inherit',
			env: { ...process.env, NODE_V8_COVERAGE },
		})._events = { close, error }
	})

	/** Combined coverage results */
	const results = []

	for (const filename of await fs.readdir(NODE_V8_COVERAGE)) {
		results.push(...JSON.parse(await fs.readFile(fp.join(NODE_V8_COVERAGE, filename), 'utf8')).result)
	}

	await fs.rmdir(NODE_V8_COVERAGE, { recursive: true })

	/** Combined LCOV results. */
	let lcovList = []

	/** Combined LCOV results. */
	let lcovInfo = ''

	/** Filter for filtered results */
	const filter = (url) => !url.protocol.startsWith('node') && !url.pathname.includes('/node_modules/') && url.pathname.includes('/src/')

	for (let result of results) {
		/** URL classed result URL */
		const url = new URL(result.url)

		if (filter(url)) {
			/** Contents of the file whose coverage was collected. */
			const data = await fs.readFile(url, 'utf8')

			/** List of code lines, where the line of code is a `data` property on the object. */
			const rows = data.split(/^/gm).map((line) => ({ data: line }))

			const lcov = {
				/** Test name */
				TN: [''],

				/** Source file */
				SF: [url.pathname],

				/** Line numbers for each function name. */
				FN: [],

				/** Execution count for the given function.*/
				FNDA: [],

				/** Number of functions found. */
				FNF: [0],

				/** Number of functions hit. */
				FNH: [0],

				/** Execution count for the given line. */
				DA: [],

				/** Number of collected lines with a positive execution count. */
				LH: [0],

				/** Number of collected lines. */
				LF: [0],
			}

			lcovList.push(lcov)

			/** Convert */
			const convert = (range, isFirstRun) => {
				let lineOffset = 0

				for (const lineIndex in rows) {
					const nextLineOffset = lineOffset + rows[lineIndex].data.length

					if (range.startLine == null && range.startOffset >= lineOffset && range.startOffset < nextLineOffset) {
						range.startLine = Number(lineIndex) + 1
						range.startCol = range.startOffset - lineOffset + 1
					}

					if (range.endOffset >= lineOffset && range.endOffset < nextLineOffset) {
						range.endLine = Number(lineIndex) + 1
						range.endCol = range.endOffset - lineOffset + 1

						if (!isFirstRun) {
							for (let j = range.startLine; j <= range.endLine; ++j) {
								if (rows[j]) {
									if (!range.count) {
										rows[j].exec = 0
									} else if (rows[j].exec == null) {
										rows[j].exec = range.count
									} else if (rows[j].exec > 0) {
										rows[j].exec += range.count
									}
								}
							}
						}

						break
					}

					lineOffset = nextLineOffset
				}

				return range
			}

			for (const coverage of result.functions) {
				let startRange = convert(coverage.ranges[0], true)
				let count = 0

				++lcov.FNF[0]

				lcov.FN.push([startRange.startLine, coverage.functionName])

				for (const range of coverage.ranges) {
					count += convert(range).count
				}

				lcov.FNDA.push([count, coverage.functionName])

				if (count) ++lcov.FNH[0]
			}

			for (const line in rows) {
				++lcov.LF[0]

				if ('exec' in rows[line]) {
					lcov.DA.push([line, rows[line].exec])

					if (rows[line].exec) ++lcov.LH[0]
				}
			}

			lcovInfo += `${Object.entries(lcov).reduce((report, [name, data]) => report.concat(data.reduce((string, each) => string.concat(`${name.toUpperCase()}:${each}\n`), '')), '')}end_of_record\n`
		}
	}

	fs.writeFile('coverage/lcov.info', lcovInfo)

	/** Returns a unicode meter based on LCOV coverage. */
	const meter = (lcov) => {
		const per = (lcov.FNH[0] / lcov.FNF[0]) * 100
		const sol = Math.trunc(per / 10)
		const haf = per % 10 >= 5 ? 1 : 0
		const emt = 10 - sol - haf
		return [`▰`.repeat(sol), `▱`.repeat(haf), dim(`▱`.repeat(emt))].join('')
	}

	/** Returns the ratio of 2 fields in LCOV data. */
	const ratio = (lcov, l, r) => `${lcov[l]}${dim('/')}${lcov[r]}`.padStart(17)

	/** Based on the given LCOV data, returns the given data in a shade of green or red. */
	const shade = (lcov, data) => (lcov.FNH / lcov.FNF > 0.6 ? green : red)(data)

	const trtd = (lcov) =>
		dim('│ ') +
		shade(
			lcov,
			lcov.SF[0]
				.slice(-31)
				.replace(/^[^/]*\//, '')
				.padEnd(31, ' '),
		) +
		' ' +
		shade(lcov, meter(lcov)) +
		dim(' │ ') +
		shade(lcov, ratio(lcov, 'FNH', 'FNF')) +
		dim(' │ ') +
		shade(lcov, ratio(lcov, 'LH', 'LF')) +
		dim(' │')

	lcovList.sort((a, b) => a.SF[0] - b.SF[0])

	console.log(
		[
			[dim('╭'), dim('─'.repeat(44)), dim('┬'), dim('─'.repeat(11)), dim('┬'), dim('─'.repeat(11)), dim('╮')].join(''),
			[dim('│'), bold('Coverage') + ' '.repeat(34), dim('│'), bold('Functions'), dim('│'), ' '.repeat(4) + bold('Lines'), dim('│')].join(' '),
			[dim('├'), dim('─'.repeat(44)), dim('┼'), dim('─'.repeat(11)), dim('┼'), dim('─'.repeat(11)), dim('┤')].join(''),
			trtd(
				lcovList.reduce(
					(all, lcov) => {
						all.FNF[0] += lcov.FNF[0]
						all.FNH[0] += lcov.FNH[0]
						all.LF[0] += lcov.LF[0]
						all.LH[0] += lcov.LH[0]
						return all
					},
					{ TN: [''], SF: ['All files'], FN: [], FNDA: [], FNF: [0], FNH: [0], DA: [], LH: [0], LF: [0] },
				),
			),
			[dim('╞'), ' '.repeat(42), dim('╪'), ' '.repeat(9), dim('╪'), ' '.repeat(9), dim('╡')].join(' '),
			...lcovList.map((lcov) => trtd(lcov)),
			[dim('╰'), dim('─'.repeat(44)), dim('┴'), dim('─'.repeat(11)), dim('┴'), dim('─'.repeat(11)), dim('╯')].join(''),
		].join('\n'),
	)
})()
