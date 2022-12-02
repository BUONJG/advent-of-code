
class Match<T, R> {
    private matched = false;
    private result: R;
    constructor(private value: T) {

    }

    public with(values: T | T[], result: R): Match<T, R> {
        if (this.matched) {
            return this;
        }

        if (Array.isArray(values) && values.includes(this.value)) {
            this.result = result;
            this.matched = true;
        }

        if (!Array.isArray(values) && values === this.value) {
            this.result = result;
            this.matched = true;
        }

        return this;
    }

    public otherwise(result: R): R {
        return this.matched ? this.result : result;
    }

    public exhaustive(): R {
        if (!this.matched) {
            throw new Error(`No match found for ${this.value}`);
        }
        return this.result;
    }
}

export function match<T, R>(value: T): Match<T, R> {
    return new Match<T, R>(value);
}
