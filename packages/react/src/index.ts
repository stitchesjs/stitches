export * from './types'
import { ReactFactory } from './types'
import _createCss from './createCss'

export const createCss = (_createCss as any) as ReactFactory
export default createCss
