
import { assert } from 'console';
import { sign } from 'crypto';
import { Tuple, InputParser, Switch, _sortBy, _chunk, _flatMapDeep, _isEqual } from './helpers';

type Segment = 's1' | 's2' | 's3' | 's4' | 's5' | 's6' | 's7';
type SegmentCode = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g';
type CodedDigit = SegmentCode[];
type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
type CodedLine = Tuple<CodedDigit[], 2>;
type Dictionary = Map<Segment, SegmentCode>;

const digits: Digit[] = new Array(10).fill(0).map((v, i) => v + i);

const predictibleDigit = (code: CodedDigit): boolean => {
    return digits.filter(d => getDigitSegments(d).length === code.length).length === 1;
}

const getDigitSegments = (digit: Digit): Segment[] => {
    return Switch<Digit, Segment[]>(digit)
        .case(0, ['s1', 's2', 's3', 's4', 's5', 's6'])
        .case(1, ['s1', 's2'])
        .case(2, ['s1', 's3', 's4', 's6', 's7'])
        .case(3, ['s1', 's2', 's3', 's6', 's7'])
        .case(4, ['s1', 's2', 's5', 's7'])
        .case(5, ['s2', 's3', 's5', 's6', 's7'])
        .case(6, ['s2', 's3', 's4', 's5', 's6', 's7'])
        .case(7, ['s1', 's2', 's6'])
        .case(8, ['s1', 's2', 's3', 's4', 's5', 's6', 's7'])
        .case(9, ['s1', 's2', 's3', 's5', 's6', 's7'])
        .exhaustive();
}

const getDigit = (segments: Segment[]): Digit => {
    return digits.find(d => _isEqual(getDigitSegments(d), segments.sort()));
}

const findSegmentCodeNotIn = (firstCode: CodedDigit, secondCode: CodedDigit): SegmentCode => {
    const codes = firstCode.filter(c => !secondCode.includes(c));
    assert(codes.length === 1);
    return codes[0];
}

const translate = (code: CodedDigit, dictionary: Dictionary): Digit => {
    const invertedDictionary = new Map<SegmentCode, Segment>();
    dictionary.forEach((value, key) => invertedDictionary.set(value, key));
    return getDigit(code.map(c => invertedDictionary.get(c)))
}

function part1(input: InputParser): number {
    const digits = input.getLines().flatMap(l => l.getTupleLines(2, ' | ').get(1).getValues<CodedDigit>(' '));
    return digits.filter(d => predictibleDigit(d)).length;
}

function part2(input: InputParser): number {
    const codedLines: CodedLine[] = input.getLines().map(l => l.getTupleLines(2, ' | ').map(d => d.getValues<CodedDigit>(' ').map(cd => _flatMapDeep(_chunk(cd, 1)))));

    let result = 0;
    for (const codedLine of codedLines) {
        const dictionary: Dictionary = new Map<Segment, SegmentCode>();

        const signal = codedLine.get(0);

        const one = signal.find(c => c.length === 2);
        const four = signal.find(c => c.length === 4);
        const seven = signal.find(c => c.length === 3);
        const height = signal.find(c => c.length === 7);
        const three = signal.find(c => c.length === 5 && one.every(co => c.includes(co)));
        const six = signal.find(c => c.length === 6 && one.some(co => !c.includes(co)));
        const zero = signal.find(c => c.length === 6 && c !== six && four.some(co => !c.includes(co)));
        const nine = signal.find(c => c.length === 6 && ![zero, six].includes(c));

        dictionary.set('s1', findSegmentCodeNotIn(height, six));
        dictionary.set('s2', findSegmentCodeNotIn(one, [dictionary.get('s1')]));
        dictionary.set('s4', findSegmentCodeNotIn(height, nine));
        dictionary.set('s6', findSegmentCodeNotIn(seven, one));
        dictionary.set('s7', findSegmentCodeNotIn(height, zero));
        dictionary.set('s5', findSegmentCodeNotIn(four, [dictionary.get('s1'), dictionary.get('s2'), dictionary.get('s7')]));
        dictionary.set('s3', findSegmentCodeNotIn(three, [dictionary.get('s1'), dictionary.get('s2'), dictionary.get('s6'), dictionary.get('s7')]));

        const output = codedLine.get(1);

        let value = '';
        for (const codedDigit of output) {
            value += translate(codedDigit, dictionary);
        }
        result += +value;
    }
    return result;
}

export default async (input: InputParser) => {
    return [part1(input), part2(input)];
}