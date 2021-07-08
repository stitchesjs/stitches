import { getCachedConfig } from './utility/getCachedConfig.js'

/** @type {import('../types/index').createCss} */
export { createCss } from './createCss.js'

/** @type {import('../types/index').defaultThemeMap} */
export { defaultThemeMap } from './default/defaultThemeMap.js'

/** @type {import('../types/index').css} */
export const css = (...args) => getCachedConfig().css(...args)

/** @type {import('../types/index').global} */
export const global = (...args) => getCachedConfig().global(...args)

/** @type {import('../types/index').keyframes} */
export const keyframes = (...args) => getCachedConfig().keyframes(...args)
