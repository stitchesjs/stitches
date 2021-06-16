export type Primitive = string | number | bigint | boolean | symbol

export type PlainObject = { [name: string]: any }

export type Try<A1 extends any, A2 extends any, Catch = never> = A1 extends A2 ? A1 : Catch

export type Value<A, X> = (A extends [] ? [] : never) | (A extends Primitive ? A : never) | {
	[K in keyof A]: A[K] extends X ? A[K] : Value<A[K], X>
} // prettier-ignore

export type Narrow<A extends any, X extends any = Function> = Try<A, [], Value<A, X>>

export type Morph<T> = (
	T extends number ?
		`${T}` | T
	: T extends 'true'
		? true | T
	: T extends 'false'
		? false | T
	: T extends `${number}`
		? number | T
	: T | undefined
) // prettier-ignore
