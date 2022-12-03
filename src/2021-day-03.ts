import { InputParser } from './helpers';

export default async (input: InputParser) => {
    type Bit = '0' | '1';
    const positions = input.getValues<string>();

    let gamaRate = '';
    let epsilonRate = '';

    let oxygenRatingPositions = [...positions];
    let co2ScrubberRatingPositions = [...positions];

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

    for (let i = 0; i < positions[0].length; i++) {
        gamaRate += getMostCommonBit(positions, i, '0');
        epsilonRate += getLeastCommonBit(positions, i, '1');

        oxygenRatingPositions = oxygenRatingPositions.filter(p => p[i] === getMostCommonBit(oxygenRatingPositions, i, '1'));
        if (co2ScrubberRatingPositions.length > 1) {
            co2ScrubberRatingPositions = co2ScrubberRatingPositions.filter(p => p[i] === getLeastCommonBit(co2ScrubberRatingPositions, i, '0'));
        }
    }

    return [parseInt(gamaRate, 2) * parseInt(epsilonRate, 2), parseInt(oxygenRatingPositions[0], 2) * parseInt(co2ScrubberRatingPositions[0], 2)];
}

