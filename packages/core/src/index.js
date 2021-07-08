import { getCachedConfig } from './utility/getCachedConfig.js'

export { createCss } from './createCss.js'
export { defaultThemeMap } from './default/defaultThemeMap.js'

export const css = (...args) => getCachedConfig().css(...args)
export const global = (...args) => getCachedConfig().global(...args)
export const keyframes = (...args) => getCachedConfig().keyframes(...args)
