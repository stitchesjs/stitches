import { createCss } from './createCss.js'
import { getCachedConfig } from './utility/getCachedConfig.js'

export { createCss } from './createCss.js'
export { defaultThemeMap } from './default/defaultThemeMap.js'

export const css = (...args) => getCachedConfig().css(...args)
export const globalCss = (...args) => getCachedConfig().globalCss(...args)
export const keyframes = (...args) => getCachedConfig().keyframes(...args)
