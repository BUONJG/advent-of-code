export class InputParser {
    public constructor(private input: string) {

    }

    public get<T>(): T {
        return this.input as any;
    }

    public getNumber(): number {
        return +this.input;
    }

    public getValues<T>(separator = '\n'): T[] {
        return this.getLines(separator).map(v => v.get<T>());
    }

    public getNumbers(separator = '\n'): number[] {
        return this.getLines(separator).map(v => v.getNumber());
    }

    public getLines(separator = '\n'): InputParser[] {
        return this.input.split(separator).filter(l => l !== '').map(l => new InputParser(l));
    }

    public getGroupOfLines(): InputParser[][] {
        return this.input.split('\n\n').map(g => new InputParser(g).getLines());
    }
}
