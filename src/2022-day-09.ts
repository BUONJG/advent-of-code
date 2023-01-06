
import { InputParser, repeat, Switch, _numbers } from './helpers';

type Direction = 'U' | 'D' | 'R' | 'L';
type Position = [number, number];

interface Move {
    direction: Direction;
    stepCount: number;
}

const getDirectionDelta = (direction: Direction): [number, number] => {
    return Switch<Direction, [number, number]>(direction)
        .case('R', [0, 1])
        .case('L', [0, -1])
        .case('U', [1, 0])
        .case('D', [-1, 0])
        .exhaustive();
}

const isTouching = (headPosition: Position, tailPosition: Position): boolean => {
    return Math.abs(headPosition[0] - tailPosition[0]) <= 1 && Math.abs(headPosition[1] - tailPosition[1]) <= 1;
}

const getMoves = (input: InputParser): Move[] => {
    return input.getLines().map(l => ({
        direction: l.getLines(' ')[0].get<Direction>(),
        stepCount: +l.getLines(' ')[1].get<string>()
    }));
}

const storePosition = (tailPositions: Set<string>, rope: Position[]): void => {
    tailPositions.add(rope.at(-1).join(';'));
}

function part1(input: InputParser): number {
    const moves = getMoves(input);

    const rope: Position[] = _numbers(0, 1).map(() => [0, 0]);

    const tailPositions = new Set<string>();

    storePosition(tailPositions, rope);

    for (const move of moves) {
        repeat(move.stepCount, () => {
            rope[0][0] += getDirectionDelta(move.direction)[0];
            rope[0][1] += getDirectionDelta(move.direction)[1];


            if (!isTouching(rope[0], rope[1])) {
                rope[1][0] += Math.sign(rope[0][0] - rope[1][0]);
                rope[1][1] += Math.sign(rope[0][1] - rope[1][1]);
            }

            storePosition(tailPositions, rope);
        });
    }

    return tailPositions.size;
}

function part2(input: InputParser): number {
    const moves = getMoves(input);

    const rope: Position[] = _numbers(0, 9).map(() => [0, 0]);

    const tailPositions = new Set<string>();

    storePosition(tailPositions, rope);

    for (const move of moves) {
        repeat(move.stepCount, () => {
            rope[0][0] += getDirectionDelta(move.direction)[0];
            rope[0][1] += getDirectionDelta(move.direction)[1];

            for (let i = 1; i < rope.length; i++) {
                if (!isTouching(rope[i - 1], rope[i])) {
                    rope[i][0] += Math.sign(rope[i - 1][0] - rope[i][0]);
                    rope[i][1] += Math.sign(rope[i - 1][1] - rope[i][1]);
                }
            }

            storePosition(tailPositions, rope);
        });
    }

    return tailPositions.size;
}

export default async (input: InputParser) => {
    return [part1(input), part2(input)];
}