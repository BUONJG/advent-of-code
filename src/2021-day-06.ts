
import { InputParser, _sum } from './helpers';

function part1(input: InputParser): number {
    let lanternfishes = input.getNumbers(',');
    for (let day = 1; day <= 80; day++) {
        let birthCount = 0;
        lanternfishes = lanternfishes.map(t => {
            if (t === 0) {
                birthCount++;
                return 6;
            }
            return t - 1;
        });

        lanternfishes.push(...new Array(birthCount).fill(8));
    }
    return lanternfishes.length;
}

function part2(input: InputParser): number {
    let lanternfishes = input.getNumbers(',');

    const countByInternalTimers = new Array(9).fill(0).map((c, i) => lanternfishes.filter(t => t === i).length);

    for (let day = 1; day <= 256; day++) {
        const birthCount = countByInternalTimers.shift();
        countByInternalTimers[6] += birthCount;
        countByInternalTimers[8] = birthCount;
    }

    return _sum(countByInternalTimers);
}

export default async (input: InputParser) => {
    return [part1(input), part2(input)];
}