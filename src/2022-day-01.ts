import { InputParser, _sortBy, _sum } from './helpers';

export default async (input: InputParser) => {
    const caloriesByElves = input.getGroupOfLines().map(g => g.map(l => l.getNumber()));
    const totalCaloriesByElves = caloriesByElves.map(calories => _sum(calories));

    const sortedElves = _sortBy(totalCaloriesByElves).reverse();

    return [sortedElves[0], sortedElves[0] + sortedElves[1] + sortedElves[2]];
}
