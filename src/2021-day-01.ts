import { InputParser } from './helpers';

const countIncreases = (values: number[]): number => {
    let increaseCount = 0;
    values.forEach((value, index) => {
        if (index > 0 && value > values[index - 1]) {
            increaseCount++;
        }
    });

    return increaseCount;
}

function part1(input: InputParser): number {
    const sonarValues = input.getNumbers();
    return countIncreases(sonarValues);
}

function part2(input: InputParser): number {
    const sonarValues = input.getNumbers();
    const cumulativeSonarValues = sonarValues.map((v, i) => i > 1 ? v + sonarValues[i - 1] + sonarValues[i - 2] : null).filter(v => v !== null);
    return countIncreases(cumulativeSonarValues);
}

export default async (input: InputParser) => {
    return [part1(input), part2(input)];
}
