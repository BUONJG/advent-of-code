
import { match, _sum } from "./helpers";

type Shape = 'Rock' | 'Paper' | 'Scissors';
type Code1 = 'A' | 'B' | 'C' | 'X' | 'Y' | 'Z';
type Code2 = 'X' | 'Y' | 'Z';
type RoundResult = 0 | 3 | 6;
type ShapePoint = 1 | 2 | 3;

const shapes: Shape[] = ['Rock', 'Paper', 'Scissors'];

const matchShape = (code: Code1): Shape => {
    return match<Code1, Shape>(code).with(['A', 'X'], 'Rock').with(['B', 'Y'], 'Paper').with(['C', 'Z'], 'Scissors').exhaustive();
}

const matchRoundResult = (code: Code2): RoundResult => {
    return match<Code2, RoundResult>(code).with('X', 0).with('Y', 3).with('Z', 6).exhaustive();
}

const getShapePoints = (shape: Shape): ShapePoint => {
    return match<Shape, ShapePoint>(shape).with('Rock', 1).with('Paper', 2).with('Scissors', 3).exhaustive();
}

export default async (input: string) => {

    const rounds1 = input.split('\n').map(r => r.split(' ').map(r => matchShape(r as Code1)));

    const getScore = (shape1: Shape, shape2: Shape): RoundResult => {
        if (shape1 === shape2) { return 3; }

        if (shape1 === 'Rock' && shape2 === 'Paper') { return 6; }
        if (shape1 === 'Paper' && shape2 === 'Scissors') { return 6; }
        if (shape1 === 'Scissors' && shape2 === 'Rock') { return 6; }

        return 0;
    }

    const totalScore1 = _sum(rounds1.map(([shape1, shape2]) => getShapePoints(shape2) + getScore(shape1, shape2)));

    const rounds2: [Shape, RoundResult][] = input.split('\n').map(r => r.split(' ')).map(r => [matchShape(r[0] as Code1), matchRoundResult(r[1] as Code2)]);

    const getShape2 = (shape1: Shape, roundResult: RoundResult): Shape => {
        return shapes.find(shape2 => getScore(shape1, shape2) === roundResult);
    }

    const totalScore2 = _sum(rounds2.map(([shape, roundResult]) => getShapePoints(getShape2(shape, roundResult)) + roundResult));

    return [totalScore1, totalScore2];
}

