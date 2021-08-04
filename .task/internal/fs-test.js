import * as fs from './fs.js'

let source = new URL('./test-source/', import.meta.url)
let target = new URL('./test-target/', import.meta.url)

fs.copydir(source, target)
