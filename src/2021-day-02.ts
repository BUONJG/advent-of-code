import { InputParser, Switch, Tuple } from './helpers';

type Direction = 'forward' | 'up' | 'down';

function part1(input: InputParser): number {
    const instructions: [Direction, number][] = input.getLines().map(l => l.getValues<string>(' ')).map(i => ([i[0] as any, +i[1]]));

    const position = { horizontal: 0, depth: 0 };
    instructions.forEach(([direction, value]) => {
        Switch<Direction, () => void>(direction)
            .case('up', () => position.depth -= value)
            .case('down', () => position.depth += value)
            .case('forward', () => position.horizontal += value)
            .exhaustive()();
    });

    return position.depth * position.horizontal;
}

function part2(input: InputParser): number {
    const instructions: [Direction, number][] = input.getLines().map(l => l.getValues<any>(' ')).map(i => ([i[0] as any, +i[1]]));
    const position = { horizontal: 0, depth: 0, aim: 0 };

    instructions.forEach(([direction, value]) => {
        Switch<Direction, () => void>(direction)
            .case('up', () => position.aim -= value)
            .case('down', () => position.aim += value)
            .case('forward', () => {
                position.horizontal += value;
                position.depth += position.aim * value;
            })
            .exhaustive()();
    });

    return position.depth * position.horizontal;
}

export default async (input: InputParser) => {
    return [part1(input), part2(input)];
}
