import { assert } from './assert';

export class Tuple<T, N extends number> extends Array<T> {
    constructor(items: Array<T>, length: N) {
        super(...items);
        assert(items.length === length, `Array length expected ${length} instead of ${items.length}`);

        Object.setPrototypeOf(this, Object.create(Tuple.prototype));
    }
    public map<R>(callbackfn: (value: T, index: number, array: T[]) => R): Tuple<R, N> {
        return super.map((v, i, a) => callbackfn(v, i, a)) as Tuple<R, N>;
    }
}
