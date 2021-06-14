export type Primitive = string | number | bigint | boolean | symbol
export type Optional = Primitive | void
export type Try<T1, T2, T3 = never, T4 = T1> = T1 extends T2 ? T4 : T3

export type ToString<T1 = ''> = `${T1}`
export type ToTailDashed<T1> = T1 extends '' ? '' : `${T1}-`
