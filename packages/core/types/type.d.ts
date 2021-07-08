export type Value<T> = (
	T extends [] ? [] : never
) | (
	T extends bigint | boolean | number | string | symbol ? T : never
) | {
	[K in keyof T]: T[K] extends Function ? T[K] : Value<T[K]>
}

export type ObjectValue<T extends object> = {
	[K in keyof T]: T[K] extends Function ? T[K] : Value<T[K]>
}

export type Parameter0<T> = T extends (arg: infer P) => any ? P : never
