import * as fs from 'fs';
import * as _ from 'lodash';

const countIncreases = (values: number[]): number => {
    let increaseCount = 0;
    values.forEach((value, index) => {
        if (index > 0 && value > values[index-1]) {
            increaseCount++;
        }
    });

    return increaseCount;
}

export default async () => {
    const input = fs.readFileSync('./inputs/2021/day-01.txt', { encoding: 'utf8'});

    const sonarValues = input.split('\n').map(v => +v);

    console.log(`Solution 1: ${countIncreases(sonarValues)}`);

    const cumulativeSonarValues = sonarValues.map((v, i) => i > 1 ? v + sonarValues[i-1] + sonarValues[i-2] : null).filter(v => v !== null);

    console.log(`Solution 2: ${countIncreases(cumulativeSonarValues)}`);
}
