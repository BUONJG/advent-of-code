
import { InputParser, _sortBy, _sum, _min, _max, _sumBy } from './helpers';

const distance = (position1: number, position2: number): number => {
    return Math.abs(position1 - position2);
}

type FuelConsumption = (distance: number) => number;

const getMinimumFuelConsumption = (positions: number[], fuelConsumption: FuelConsumption): number => {
    let minimumFuelNeeded = Infinity;
    for (let targetPosition = _min(positions); targetPosition <= _max(positions); targetPosition++) {
        const fuelNeeded = _sumBy(positions, p => fuelConsumption(distance(p, targetPosition)));
        minimumFuelNeeded = Math.min(minimumFuelNeeded, fuelNeeded);
    }

    return minimumFuelNeeded;
};

function part1(input: InputParser): number {
    const positions = input.getNumbers(',');
    return getMinimumFuelConsumption(positions, d => d);
}

function part2(input: InputParser): number {
    const positions = input.getNumbers(',');
    return getMinimumFuelConsumption(positions, d => d * (d + 1) / 2);
}

export default async (input: InputParser) => {
    return [part1(input), part2(input)];
}