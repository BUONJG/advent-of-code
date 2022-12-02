import { IoHelper } from './helpers';
import * as fs from 'fs';

(async () => {
    const year = await IoHelper.ask('Event year: ', '-a');
    const day = await IoHelper.ask('Day: ', '-d');

    console.log(`Executing Year ${year} / Day ${day}`);

    const file = `./dist/${year}/day-${day}.js`;
    if (!fs.existsSync(file)) {
        throw Error(`File ${file} not found`);
    }
    const action = await import(`./${year}/day-${day}`);

    const controlInput = fs.readFileSync(`./inputs/${year}/day-${day}/control.txt`, { encoding: 'utf8'});
    const expectedSolutions: number[] = JSON.parse(fs.readFileSync(`./inputs/${year}/day-${day}/solutions.json`, { encoding: 'utf8'}))
    const controlSolutions = await action.default(controlInput);
    if (!Array.isArray(controlSolutions)) {
        throw new Error(`Array expected`);
    }

    if (controlSolutions.length !== expectedSolutions.length) {
        throw new Error(`Solution count are not the same...`);
    }

    expectedSolutions.forEach((expectedSolution, index) => {
        if (expectedSolution !== controlSolutions[index]) {
            throw new Error(`Solution ${index+1} is wrong: expected = ${expectedSolution} / response = ${controlSolutions[index]}`);
        }
    })

    const input = fs.readFileSync(`./inputs/${year}/day-${day}/input.txt`, { encoding: 'utf8'});
    const solutions: number[] = await action.default(input);
    solutions.forEach((solution, index) => {
        console.log(`Solution ${index+1}: ${solution}`);
    });

})()
.then(() => process.exit(0))
.catch(error => {
    console.log(error);
    process.exit(1);
});