
import { InputParser, Switch, _sum } from "./helpers";

type Shape = 'Rock' | 'Paper' | 'Scissors';
type Code1 = 'A' | 'B' | 'C' | 'X' | 'Y' | 'Z';
type Code2 = 'X' | 'Y' | 'Z';
type RoundResult = 0 | 3 | 6;
type ShapePoint = 1 | 2 | 3;

const shapes: Shape[] = ['Rock', 'Paper', 'Scissors'];

const parseShape = (code: Code1): Shape => {
    return Switch<Code1, Shape>(code)
        .case(['A', 'X'], 'Rock')
        .case(['B', 'Y'], 'Paper')
        .default('Scissors');
}

const parseRoundResult = (code: Code2): RoundResult => {
    return Switch<Code2, RoundResult>(code)
        .case('X', 0)
        .case('Y', 3)
        .case('Z', 6)
        .exhaustive();
}

const getShapePoints = (shape: Shape): ShapePoint => {
    return Switch<Shape, ShapePoint>(shape)
        .case('Rock', 1)
        .case('Paper', 2)
        .case('Scissors', 3)
        .exhaustive();
}

const getScore = (shape1: Shape, shape2: Shape): RoundResult => {
    return Switch<[Shape, Shape], RoundResult>([shape1, shape2])
        .case(([shape1, shape2]) => shape1 === shape2, 3)
        .case(['Rock', 'Paper'], 6)
        .case(['Paper', 'Scissors'], 6)
        .case(['Scissors', 'Rock'], 6)
        .default(0);
}

function part1(input: InputParser): number {
    const rounds1 = input.getLines().map(l => l.getValues(' ').map(r => parseShape(r as Code1)));
    return _sum(rounds1.map(([shape1, shape2]) => getShapePoints(shape2) + getScore(shape1, shape2)));
}

function part2(input: InputParser): number {
    const rounds2: [Shape, RoundResult][] = input.getLines().map(r => r.getValues(' ')).map(r => [parseShape(r[0] as Code1), parseRoundResult(r[1] as Code2)]);

    const getShape2 = (shape1: Shape, roundResult: RoundResult): Shape => {
        return shapes.find(shape2 => getScore(shape1, shape2) === roundResult);
    }

    return _sum(rounds2.map(([shape, roundResult]) => getShapePoints(getShape2(shape, roundResult)) + roundResult));
}

export default async (input: InputParser) => {
    return [part1(input), part2(input)];
}

