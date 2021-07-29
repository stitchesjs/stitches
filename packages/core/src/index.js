import { getCachedConfig } from './utility/getCachedConfig.js'

export { createStitches } from './createStitches.js'
export { defaultThemeMap } from './default/defaultThemeMap.js'

export const css = (...args) => getCachedConfig().css(...args)
export const globalCss = (...args) => getCachedConfig().globalCss(...args)
export const keyframes = (...args) => getCachedConfig().keyframes(...args)
