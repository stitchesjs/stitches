import { createCss } from './createCss.js'
import { defaultThemeMap } from './default/defaultThemeMap.js'
import { getCachedConfig } from './utility/getCachedConfig.js'

const css = (...args) => getCachedConfig().css(...args)
const global = (...args) => getCachedConfig().global(...args)
const keyframes = (...args) => getCachedConfig().keyframes(...args)

export { createCss, css, global, keyframes, defaultThemeMap }
