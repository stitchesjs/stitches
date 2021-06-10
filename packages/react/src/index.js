import { createCss } from './createCss.js'
import { defaultThemeMap } from '../../core/src/default/defaultThemeMap.js'
import { getCachedConfig } from './utility/getCachedConfig.js'

const css = (...args) => getCachedConfig().css(...args)
const global = (...args) => getCachedConfig().global(...args)
const keyframes = (...args) => getCachedConfig().keyframes(...args)
const styled = (...args) => getCachedConfig().styled(...args)

export { createCss, css, global, keyframes, styled, defaultThemeMap }
