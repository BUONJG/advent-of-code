import { Tuple, _flatMapDeep, _sum, _zip } from './helpers';

interface BoardItem {
    value: number;
    marked: boolean;
}

type BoardLine = Tuple<BoardItem, 5>;
type Board = Tuple<BoardLine, 5>;

export default async (input: string) => {
    return [part1(input), part2(input)];
}

function part1(input: string): number {
    const { drawnNumbers, boards } = parseInput(input);

    let winningBoard: Board; let lastDrawNumber: number;
    while (!winningBoard) {
        lastDrawNumber = drawnNumbers.shift();
        markBoards(boards, lastDrawNumber);
        winningBoard = boards.find(b => isWinningBoard(b));
    }

    return sumOfUnmarkedNumbers(winningBoard) * lastDrawNumber;
}

function part2(input: string): number {
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

function parseInput(input: string) {
    const [drawnNumbersInput, ...boardInputs] = input.split('\n\n');
    const drawnNumbers = drawnNumbersInput.split(',').map(v => +v);
    const boards: Board[] = <any>boardInputs.map(b => b.split('\n').map(bl => bl.split(' ').filter(s => s !== '').map(s => ({ value: +s, marked: false }))));

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
    return <any>_zip(...board);
}

function sumOfUnmarkedNumbers(board: Board): number {
    return _sum(_flatMapDeep(board).filter(i => !i.marked).map(i => i.value));
}
