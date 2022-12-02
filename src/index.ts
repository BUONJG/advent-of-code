import { IoHelper, FileHelper, PromiseHelper } from './helpers';


(async () => {
    const year = await IoHelper.ask('Event year: ', '-a');
    const day = await IoHelper.ask('Day: ', '-d');

    console.log(`Executing Year ${year} / Day ${day}`);

    const controlLocation = `./inputs/${year}/day-${day}/control`;
    await FileHelper.writeIfNotExists(controlLocation, '');

    const solutionLocation = `./inputs/${year}/day-${day}/solutions.json`;
    await FileHelper.writeIfNotExists(solutionLocation, '[null, null]');

    const inputLocation = `./inputs/${year}/day-${day}/input`;
    await FileHelper.writeIfNotExists(inputLocation, '');

    const created = await FileHelper.writeIfNotExists(`./src/${year}/day-${day}.ts`, 'export default async (input: string) => {\nreturn [1, null];\n}\n\n');
    if (created) {
        await PromiseHelper.wait(2);
    }

    const action = await import(`./${year}/day-${day}`);
    const controlInput = await FileHelper.read(controlLocation);
    const controlSolutions = await action.default(controlInput);

    if (!Array.isArray(controlSolutions) || controlSolutions.length !== 2) {
        throw new Error(`Incorrect response (array expected)!`);
    }

    const expectedSolutions = await FileHelper.read<number[]>(solutionLocation, 'json');
    expectedSolutions.forEach((expectedSolution, index) => {
        if (expectedSolution !== controlSolutions[index]) {
            throw new Error(`Solution ${index+1} is wrong: expected = ${expectedSolution} / response = ${controlSolutions[index]}`);
        }
    })

    const input = await FileHelper.read(`./inputs/${year}/day-${day}/input`);
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