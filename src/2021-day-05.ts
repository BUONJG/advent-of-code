
import { assert, InputParser, Switch, _max, _min } from './helpers';

type Coordinates = number[];
type Line = Coordinates[];
type Diagram = Map<string, number>;

const incrementPoint = (diagram: Diagram, x: number, y: number): void => {
    const coordinates = `${x},${y}`;
    diagram.set(coordinates, (diagram.get(coordinates) ?? 0) + 1);
};

const traceHorizontalLine = (diagram: Diagram, x: number, y1: number, y2: number): void => {
    for (let y = _min([y1, y2]); y <= _max([y1, y2]); y++) {
        incrementPoint(diagram, x, y);
    }
};

const traceVerticallLine = (diagram: Diagram, x1: number, x2: number, y: number): void => {
    for (let x = _min([x1, x2]); x <= _max([x1, x2]); x++) {
        incrementPoint(diagram, x, y);
    }
};

const traceDiagonalLine = (diagram: Diagram, x1: number, y1: number, x2: number, y2: number): void => {
    assert(Math.abs(x1 - x2) === Math.abs(y1 - y2), 'Line is not a diagonal!');

    for (let delta = 0; delta <= Math.abs(x2 - x1); delta++) {
        incrementPoint(diagram, x1 + delta * (x2 > x1 ? 1 : -1), y1 + delta * (y2 > y1 ? 1 : -1));
    }
};

function part1(input: InputParser): number {
    const lines: Line[] = input.getLines().map(l => l.getLines(' -> ').map(c => c.getNumbers(',')));

    const diagram: Diagram = new Map<string, number>();
    for (const line of lines) {
        Switch<Line, () => void>(line)
            .case(([c1, c2]) => c1[0] === c2[0], () => traceHorizontalLine(diagram, line[0][0], line[0][1], line[1][1]))
            .case(([c1, c2]) => c1[1] === c2[1], () => traceVerticallLine(diagram, line[0][0], line[1][0], line[0][1]))
            .default(() => { })();
    }
    return Array.from(diagram.values()).filter(v => v > 1).length;
}

function part2(input: InputParser): number {
    const lines: Line[] = input.getLines().map(l => l.getLines(' -> ').map(c => c.getNumbers(',')));

    const diagram: Diagram = new Map<string, number>();
    for (const line of lines) {
        Switch<Line, () => void>(line)
            .case(([c1, c2]) => c1[0] === c2[0], () => traceHorizontalLine(diagram, line[0][0], line[0][1], line[1][1]))
            .case(([c1, c2]) => c1[1] === c2[1], () => traceVerticallLine(diagram, line[0][0], line[1][0], line[0][1]))
            .default(() => traceDiagonalLine(diagram, line[0][0], line[0][1], line[1][0], line[1][1]))();
    }
    return Array.from(diagram.values()).filter(v => v > 1).length;
}

export default async (input: InputParser) => {
    return [part1(input), part2(input)];
}