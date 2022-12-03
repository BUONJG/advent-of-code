import { IoHelper, FileHelper, PromiseHelper } from './helpers';


(async () => {
    const year = await IoHelper.ask('Event year: ', '-y');
    const day = await IoHelper.ask('Day: ', '-d');

    console.log(`Executing Year ${year} / Day ${day}`);

    const controlLocation = `./data/${year}-day-${day}.control`;
    const solutionLocation = `./data/${year}-day-${day}.control.json`;
    const inputLocation = `./data/${year}-day-${day}.input`;
    const scriptLocation = `./src/${year}-day-${day}.ts`;

    await FileHelper.writeIfNotExists(controlLocation, '');
    await FileHelper.writeIfNotExists(solutionLocation, '[null, null]');
    await FileHelper.writeIfNotExists(inputLocation, '');
    if (await FileHelper.writeIfNotExists(scriptLocation, 'export default async (input: string) => {\nreturn [null, null];\n}\n\n')) {
        await PromiseHelper.wait(2);
    }

    const action = await import(`./${year}-day-${day}`);
    const controlInput = await FileHelper.read(controlLocation);
    const controlSolutions = await action.default(controlInput);

    if (!Array.isArray(controlSolutions) || controlSolutions.length !== 2) {
        throw new Error(`Incorrect response (array expected)!`);
    }

    const expectedSolutions = await FileHelper.read<number[]>(solutionLocation, 'json');
    expectedSolutions.forEach((expectedSolution, index) => {
        if (expectedSolution !== controlSolutions[index]) {
            throw new Error(`Solution ${index + 1} is wrong: expected = ${expectedSolution} / response = ${controlSolutions[index]}`);
        }
    })

    const input = await FileHelper.read(inputLocation);
    if (!input) {
        throw new Error(`Please set your input in ${inputLocation}`);
    }

    const solutions: number[] = await action.default(input);
    solutions.forEach((solution, index) => {
        console.log(`Solution ${index + 1}: ${solution ?? 'Not implemented yet...'}`);
    });

})()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
    });