import { InputParser, _flatMapDeep, _sum, _zip } from './helpers';

interface BoardItem {
    value: number;
    marked: boolean;
}

type BoardLine = BoardItem[];
type Board = BoardLine[];



function parseInput(input: InputParser) {
    const [drawnNumbersInput, ...boardInputs] = input.getGroupOfLines();
    const drawnNumbers = drawnNumbersInput[0].getNumbers(',');
    const boards: Board[] = boardInputs.map(b => b.map(bl => bl.getNumbers(' ').map(value => ({ value, marked: false }))));

    return { drawnNumbers, boards };
}

function markBoards(boards: Board[], draw: number): void {
    boards.forEach(board => {
        markBoard(board, draw);
    });
}

function markBoard(board: Board, draw: number): void {
    _flatMapDeep(board).filter(i => i.value === draw).forEach(item => item.marked = true);
}

function isWinningBoard(board: Board): boolean {
    if (board.some(bl => bl.every(i => i.marked))) {
        return true;
    }

    if (transpose(board).some(bl => bl.every(i => i.marked))) {
        return true;
    }

    return false;
}

function transpose(board: Board): Board {
    return _zip(...board);
}

function sumOfUnmarkedNumbers(board: Board): number {
    return _sum(_flatMapDeep(board).filter(i => !i.marked).map(i => i.value));
}

function part1(input: InputParser): number {
    const { drawnNumbers, boards } = parseInput(input);

    let winningBoard: Board; let lastDrawNumber: number;
    while (!winningBoard) {
        lastDrawNumber = drawnNumbers.shift();
        markBoards(boards, lastDrawNumber);
        winningBoard = boards.find(b => isWinningBoard(b));
    }

    return sumOfUnmarkedNumbers(winningBoard) * lastDrawNumber;
}

function part2(input: InputParser): number {
    const { drawnNumbers, boards } = parseInput(input);

    let remainingBoards = [...boards]; let lastWinningBoard: Board; let lastDrawNumber: number;
    while (remainingBoards.length) {
        lastDrawNumber = drawnNumbers.shift();
        markBoards(remainingBoards, lastDrawNumber);
        lastWinningBoard = remainingBoards.find(b => isWinningBoard(b));
        remainingBoards = remainingBoards.filter(b => !isWinningBoard(b));
    }

    return sumOfUnmarkedNumbers(lastWinningBoard) * lastDrawNumber;
}

export default async (input: InputParser) => {
    return [part1(input), part2(input)];
}
