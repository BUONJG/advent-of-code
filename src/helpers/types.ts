import { assert } from "./assert";

export type Tuple<T, N extends number, R extends readonly T[] = [],> = R['length'] extends N ? R : Tuple<T, N, readonly [T, ...R]>;

export function getTuple<T, N extends number>(array: T[], n: N): Tuple<T, N> {
    assert(array.length === n, `Array length expected ${n} instead of ${array.length}`);
    return array as Tuple<T, N>;
}
