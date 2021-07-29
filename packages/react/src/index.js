import { getCachedConfig } from './utility/getCachedConfig.js'

export { createStitches } from './createStitches.js'
export { defaultThemeMap } from '../../core/src/default/defaultThemeMap.js'

export const createTheme = (...args) => getCachedConfig().createTheme(...args)
export const globalCss = (...args) => getCachedConfig().globalCss(...args)
export const keyframes = (...args) => getCachedConfig().keyframes(...args)

export const css = (...args) => getCachedConfig().css(...args)
export const styled = (...args) => getCachedConfig().styled(...args)
