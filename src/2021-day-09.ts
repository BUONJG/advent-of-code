
import { InputParser, _compact, _sortBy, _sumBy, _uniqBy } from './helpers';

interface Point {
    x: number;
    y: number;
    heigh: number;
}

type HighMap = string[][];

const getPoint = (highmap: HighMap, x: number, y: number): Point => {
    if (highmap[x] && highmap[x][y]) {
        return { x, y, heigh: +highmap[x][y] };
    }
    return null;
}

const getPoints = (highmap: HighMap): Point[] => {
    const points: Point[] = [];
    highmap.forEach((line, x) => {
        line.forEach((heigh, y) => {
            points.push({ x, y, heigh: +heigh });
        });
    });
    return points;
}

const getLowPoints = (highmap: HighMap): Point[] => {
    const lowPoints: Point[] = [];

    getPoints(highmap).forEach(point => {
        if (getNeighbors(highmap, point.x, point.y).every(p => p.heigh > point.heigh)) {
            lowPoints.push(point);
        }
    });
    return lowPoints;
}

const getBasin = (highmap: HighMap, points: Point[]): Point[] => {
    const newNeighbors = _uniqBy([...points, ...points.flatMap(p => getNeighbors(highmap, p.x, p.y).filter(p => p.heigh !== 9))], p => `${p.x};${p.y}`);
    if (newNeighbors.length > points.length) {
        return getBasin(highmap, newNeighbors);
    }
    return points;
}

const getNeighbors = (highmap: HighMap, x: number, y: number): Point[] => {
    return _compact([getPoint(highmap, x - 1, y), getPoint(highmap, x + 1, y), getPoint(highmap, x, y - 1), getPoint(highmap, x, y + 1)]);
}

function part1(input: InputParser): number {
    const highmap = input.getLines().map(i => i.getCharacters<string>());
    return _sumBy(getLowPoints(highmap), l => l.heigh + 1);
}

function part2(input: InputParser): number {
    const highmap = input.getLines().map(i => i.getCharacters<string>());

    const basins = getLowPoints(highmap).map(lowPoint => getBasin(highmap, [lowPoint]));

    return _sortBy(basins, b => b.length).reverse().slice(0, 3).map(b => b.length).reduce((r, v) => r * v, 1);
}

export default async (input: InputParser) => {
    return [part1(input), part2(input)];
}