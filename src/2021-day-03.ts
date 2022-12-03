import { InputParser } from './helpers';

type Bit = '0' | '1';

const getCounts = (positions: string[], index: number): Map<Bit, Number> => {
    const result = new Map<Bit, number>();
    const bits = positions.map(p => p[index]);
    result.set('0', bits.filter(b => b === '0').length);
    result.set('1', bits.filter(b => b === '1').length);
    return result;
}

const getMostCommonBit = (positions: string[], index: number, defaultResponse: Bit): Bit => {
    const counts = getCounts(positions, index);
    if (counts.get('0') === counts.get('1')) {
        return defaultResponse;
    }

    return counts.get('0') > counts.get('1') ? '0' : '1';
}

const getLeastCommonBit = (positions: string[], index: number, defaultResponse: Bit): Bit => {
    const counts = getCounts(positions, index);
    if (counts.get('0') === counts.get('1')) {
        return defaultResponse;
    }

    return counts.get('0') < counts.get('1') ? '0' : '1';
}

function part1(input: InputParser): number {
    const positions = input.getValues<string>();

    let gamaRate = ''; let epsilonRate = '';
    for (let i = 0; i < positions[0].length; i++) {
        gamaRate += getMostCommonBit(positions, i, '0');
        epsilonRate += getLeastCommonBit(positions, i, '1');
    }

    return parseInt(gamaRate, 2) * parseInt(epsilonRate, 2);
}

function part2(input: InputParser): number {
    const positions = input.getValues<string>();

    let oxygenRatingPositions = [...positions]; let co2ScrubberRatingPositions = [...positions];
    for (let i = 0; i < positions[0].length; i++) {
        oxygenRatingPositions = oxygenRatingPositions.filter(p => p[i] === getMostCommonBit(oxygenRatingPositions, i, '1'));
        if (co2ScrubberRatingPositions.length > 1) {
            co2ScrubberRatingPositions = co2ScrubberRatingPositions.filter(p => p[i] === getLeastCommonBit(co2ScrubberRatingPositions, i, '0'));
        }
    }
    return parseInt(oxygenRatingPositions[0], 2) * parseInt(co2ScrubberRatingPositions[0], 2);
}

export default async (input: InputParser) => {
    return [part1(input), part2(input)];
}
