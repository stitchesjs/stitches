export interface GroupSheet {
	sheet: CSSStyleSheet
	rules: GroupRules
}

export type GroupName = 'themed' | 'global' | 'styled' | 'varied' | 'inline'

export type GroupRules = {
	[name in GroupName]: Group
}

export interface Group {
	group: CSSMediaRule
	index: number
	cache: Set<string>
}

export interface Style {
	[key: string]: number | string | Style
}

export interface ThemeConfig {
	[scale: string]: { [token: string]: string }
}

export interface ThemeMapConfig {
	[property: string]: string
}

export interface MediaConfig {
	[name: string]: string
}

export interface UtilsConfig {
	[property: string]: (config: Config) => (value) => Style
}

export interface Config {
	prefix: string
	media: MediaConfig
	root: DocumentOrShadowRoot
	theme: ThemeConfig
	themeMap: ThemeMapConfig
	utils: UtilsConfig
}
