import { InputParser } from './helpers';

type direction = 'forward' | 'up' | 'down';

export default async (input: InputParser) => {
    const instructions: [direction, number][] = input.getLines().map(l => l.getValues<any>(' ')).map(i => ([i[0] as any, +i[1]]));

    const position1 = { horizontal: 0, depth: 0 };
    instructions.forEach(([direction, value]) => {
        switch (direction) {
            case 'up':
                position1.depth -= value;
                break;
            case 'down':
                position1.depth += value;
                break;
            case 'forward':
                position1.horizontal += value;
                break;
        }
    })

    const position2 = { horizontal: 0, depth: 0, aim: 0 };

    instructions.forEach(([direction, value]) => {
        switch (direction) {
            case 'up':
                position2.aim -= value;
                break;
            case 'down':
                position2.aim += value;
                break;
            case 'forward':
                position2.horizontal += value;
                position2.depth += position2.aim * value;
                break;
        }
    })

    return [position1.depth * position1.horizontal, position2.depth * position2.horizontal];
}
