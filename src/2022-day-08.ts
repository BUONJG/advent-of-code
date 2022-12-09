
import { InputParser, _numbers } from './helpers';

const isVisible = (treeMap: string[][], row: number, col: number): boolean => {
    const rowCount = treeMap.length;
    const colCount = treeMap[0].length;
    return _numbers(0, row - 1).every(r => treeMap[r][col] < treeMap[row][col])
        || _numbers(row + 1, rowCount - 1).every(r => treeMap[r][col] < treeMap[row][col])
        || _numbers(0, col - 1).every(c => treeMap[row][c] < treeMap[row][col])
        || _numbers(col + 1, colCount - 1).every(c => treeMap[row][c] < treeMap[row][col]);
}

const scenicScore = (treeMap: string[][], row: number, col: number): number => {
    const rowCount = treeMap.length;
    const colCount = treeMap[0].length;

    return [
        _numbers(0, row - 1).reverse().map(r => treeMap[r][col]),
        _numbers(row + 1, rowCount - 1).map(r => treeMap[r][col]),
        _numbers(0, col - 1).reverse().map(c => treeMap[row][c]),
        _numbers(col + 1, colCount - 1).map(c => treeMap[row][c])
    ]
        .map(trees => {
            const index = trees.findIndex(h => h >= treeMap[row][col]);
            if (index === -1) {
                return trees.length;
            } else {
                return index + 1;
            }
        })
        .reduce((p, c) => p * c, 1);
}

function part1(input: InputParser): number {
    const treeMap = input.getLines().map(l => l.getCharacters());

    let visibleTreeCount = 0;
    treeMap.forEach((row, rowNumber) => {
        row.forEach((_height, columnNumber) => {
            visibleTreeCount += isVisible(treeMap, rowNumber, columnNumber) ? 1 : 0;
        });
    });
    return visibleTreeCount;
}

function part2(input: InputParser): number {
    const treeMap = input.getLines().map(l => l.getCharacters());

    let maxScenicScore = 0;
    treeMap.forEach((row, rowNumber) => {
        row.forEach((_height, columnNumber) => {
            maxScenicScore = Math.max(maxScenicScore, scenicScore(treeMap, rowNumber, columnNumber));
        });
    });
    return maxScenicScore;
}

export default async (input: InputParser) => {
    return [part1(input), part2(input)];
}