import { assert } from './assert';

export class Tuple<T, N extends number> implements Iterable<T> {
    public constructor(private array: T[], private length: N) {
        assert(array.length === length, `Array length expected ${length} instead of ${array.length}`);
    }

    [Symbol.iterator](): TupleIterator<T> {
        return new TupleIterator(this.array);
    }

    public map<R>(mapper: (v: T) => R): Tuple<R, N> {
        return new Tuple<R, N>(this.array.map(v => mapper(v)), this.length);
    }

    public find(finder: (v: T) => boolean): T {
        return this.array.find(v => finder(v));
    }
}

class TupleIterator<T> implements Iterator<T> {
    private index = 0;
    private done = false;

    constructor(private values: T[]) {
    }

    public next(): IteratorResult<T, number | undefined> {
        if (this.done) {
            return { done: this.done, value: undefined };
        }

        if (this.index === this.values.length) {
            this.done = true;
            return { done: this.done, value: this.index };
        }

        const value = this.values[this.index];
        this.index++;
        return { done: false, value };
    }
}
