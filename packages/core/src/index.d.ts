import { Narrow } from '../types/utility'

import { createCss, Config, ConfigInit, CreateCss, Stitches } from '../types/createCss'
import { DefaultThemeMap } from './default/defaultThemeMap'

export { DefaultThemeMap, Stitches }

export type ExportedCss = Stitches<{}>['css']
export type ExportedGlobal = Stitches<{}>['global']
export type ExportedKeyframes = Stitches<{}>['keyframes']

export const createCss: CreateCss
export const css: ExportedCss
export const global: ExportedGlobal
export const keyframes: ExportedKeyframes
export const defaultThemeMap: DefaultThemeMap
