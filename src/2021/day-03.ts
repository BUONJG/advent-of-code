export default async (input: string) => {
    const positions = input.split('\n');

    let gamaRate = '';
    let epsilonRate = '';
    for (let i = 0; i < positions[0].length; i++) {
        const bits = positions.map(p => p[i]);
        const mostCommonBit = bits.filter(b => b === '1').length > bits.filter(b => b === '0').length ? '1' : '0';
        gamaRate += mostCommonBit;
        epsilonRate += mostCommonBit === '1' ? '0' : '1';
    }
    return [parseInt(gamaRate, 2) * parseInt(epsilonRate, 2), null];
}

