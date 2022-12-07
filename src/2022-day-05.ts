
import { InputParser, repeat } from './helpers';

interface Move {
    craneCount: number;
    from: number;
    to: number;
}

type Crane = string;

type State = Map<number, Crane[]>;

const parseInput = (input: InputParser): { state: State; moves: Move[] } => {
    const state: State = new Map<number, Crane[]>();
    const stateLines = input.getGroupOfLines()[0].reverse();
    for (let line = 1; line < stateLines.length; line++) {
        repeat(100, (i) => {
            const column = +stateLines[0].get<string>()[1 + 4 * i];
            const crane: Crane = stateLines[line].get<string>()[1 + 4 * i];
            if (![undefined, ' '].includes(crane)) {
                if (!state.has(column)) {
                    state.set(column, []);
                }
                state.get(column).push(stateLines[line].get<string>()[1 + 4 * i]);
            }
        });
    }

    const moves: Move[] = input.getGroupOfLines()[1].map(l => l.getValues(' ')).map(move => ({ craneCount: +move[1], from: +move[3], to: +move[5] }));

    return { state, moves };
}

function part1(input: InputParser): string {
    const { state, moves } = parseInput(input);

    for (const move of moves) {
        repeat(move.craneCount, () => {
            const movedCrane = state.get(move.from).pop();
            state.get(move.to).push(movedCrane);
        });
    }

    return Array.from(state.values()).map(c => c.pop()).join('');
}

function part2(input: InputParser): string {
    const { state, moves } = parseInput(input);

    for (const move of moves) {
        state.get(move.to).push(...state.get(move.from).slice(-move.craneCount));
        state.set(move.from, state.get(move.from).slice(0, state.get(move.from).length - move.craneCount));
    }

    return Array.from(state.values()).map(c => c.pop()).join('');
}

export default async (input: InputParser) => {
    return [part1(input), part2(input)];
}