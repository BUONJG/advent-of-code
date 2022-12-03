import { isEqual } from 'lodash';

type Matcher<T> = T | T[] | ((value: T) => boolean);

class SwitchCase<T, R> {
    private matched = false;
    private result: R;
    constructor(private value: T) {
    }

    public case(matcher: Matcher<T>, result: R): SwitchCase<T, R> {
        if (this.matched) {
            return this;
        }

        if (isEqual(matcher, this.value)) {
            this.match(result);
        }

        if (matcher instanceof Function && matcher(this.value)) {
            this.match(result);
        }

        if (Array.isArray(matcher) && matcher.some(v => isEqual(v, this.value))) {
            this.match(result);
        }

        return this;
    }

    public default(result: R): R {
        return this.matched ? this.result : result;
    }

    public exhaustive(): R {
        if (!this.matched) {
            throw new Error(`No match found for ${this.value}`);
        }
        return this.result;
    }

    private match(result: R): void {
        this.result = result;
        this.matched = true;
    }
}

export function Switch<T, R>(value: T): SwitchCase<T, R> {
    return new SwitchCase<T, R>(value);
}
