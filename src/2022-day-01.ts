import { _sortBy, _sum } from './helpers';

export default async (input: string) => {
    const caloriesByElves = input.split('\n\n').map(g => g.split('\n').map(v => +v));
    const totalCaloriesByElves = caloriesByElves.map(calories => _sum(calories));

    const sortedElves = _sortBy(totalCaloriesByElves).reverse();

    return [sortedElves[0], sortedElves[0] + sortedElves[1] + sortedElves[2]];
}
