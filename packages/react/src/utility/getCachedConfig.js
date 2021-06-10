import { createCss } from '../createCss.js'

let cachedConfig

export const getCachedConfig = () => cachedConfig || (cachedConfig = createCss())
