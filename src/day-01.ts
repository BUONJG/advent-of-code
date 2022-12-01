import * as fs from 'fs';
import * as _ from 'lodash';

(async () => {
    const input = fs.readFileSync('./inputs/day-01.txt', { encoding: 'utf8'});

    const caloriesByElves = input.split('\n\n').map(g => g.split('\n').map(v => +v));
    const totalCaloriesByElves = caloriesByElves.map(calories => _.sum(calories));

    const sortedElves = _.sortBy(totalCaloriesByElves).reverse();

    console.log(`Solution 1: ${sortedElves[0]}`);
    console.log(`Solution 2: ${sortedElves[0] + sortedElves[1] + sortedElves[2]}`);

})().catch(error => {
    console.log(error);
})

