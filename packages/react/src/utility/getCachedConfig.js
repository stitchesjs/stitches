import { createStitches } from '../createStitches.js'

let cachedConfig

export const getCachedConfig = () => cachedConfig || (cachedConfig = createStitches())
