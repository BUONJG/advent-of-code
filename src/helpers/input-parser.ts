import { _chunk, _flatMapDeep } from './lodash';
import { Tuple } from './tuple';

export class InputParser {
    public constructor(private input: string) {

    }

    public get<T = string>(): T {
        return this.input as any;
    }

    public getCharacters<T = string>(): T[] {
        return _flatMapDeep(_chunk(this.input as any, 1));
    }

    public getNumber(): number {
        return +this.input;
    }

    public getValues<T = string>(separator = '\n'): T[] {
        return this.getLines(separator).map(v => v.get<T>());
    }

    public getTuple<T, L extends number>(length: L, separator = '\n'): Tuple<T, L> {
        return new Tuple<T, L>(this.getValues<T>(separator), length);
    }

    public getNumbers(separator = '\n'): number[] {
        return this.getLines(separator).map(v => v.getNumber());
    }

    public getTupleNumbers<L extends number>(length: L, separator = '\n'): Tuple<number, L> {
        return new Tuple<number, L>(this.getNumbers(separator), length);
    }

    public getLines(separator = '\n'): InputParser[] {
        return this.input.split(separator).filter(l => l !== '').map(l => new InputParser(l));
    }

    public getTupleLines<L extends number>(length: L, separator = '\n'): Tuple<InputParser, L> {
        return new Tuple<InputParser, L>(this.getLines(separator), length);
    }

    public getGroupOfLines(): InputParser[][] {
        return this.input.split('\n\n').map(g => new InputParser(g).getLines());
    }
}
