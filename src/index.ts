import { IoHelper, FileHelper, PromiseHelper, InputParser } from './helpers';

const execute = async (year: number | string, day: number | string, bootstrapIfMissing = false): Promise<void> => {
    day = `00${day}`.slice(-2);
    const scriptLocation = `./src/${year}-day-${day}.ts`;

    if (!bootstrapIfMissing && !await FileHelper.exists(scriptLocation)) {
        return;
    }

    console.log(`**********************`);
    console.log(`* Year ${year} / Day ${day} *`);
    console.log(`**********************`);

    const controlLocation = `./data/${year}-day-${day}.control`;
    const solutionLocation = `./data/${year}-day-${day}.control.json`;
    const inputLocation = `./data/${year}-day-${day}.input`;
    const templateLocation = `./src/template.ts`;

    await FileHelper.writeIfNotExists(controlLocation, '');
    await FileHelper.writeIfNotExists(solutionLocation, '[null, null]');
    await FileHelper.writeIfNotExists(inputLocation, '');
    if (await FileHelper.writeIfNotExists(scriptLocation, await FileHelper.read(templateLocation))) {
        await PromiseHelper.wait(2);
    }

    const action = await import(`./${year}-day-${day}`);
    const controlInput = await FileHelper.read(controlLocation);
    const controlSolutions = await action.default(new InputParser(controlInput));

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

    const solutions: number[] = await action.default(new InputParser(input));
    solutions.forEach((solution, index) => {
        console.log(`Solution ${index + 1}: ${solution ?? 'Not implemented yet...'}`);
    });
}

(async () => {
    if (IoHelper.hasOption('-a')) {
        for (let year = 2015; year <= new Date().getFullYear(); year++) {
            for (let day = 1; day <= 25; day++) {
                await execute(year, day);
            }
        }
    } else {
        const year = await IoHelper.ask('Event year: ', '-y');
        const day = await IoHelper.ask('Day: ', '-d');
        await execute(year, day, true);
    }
})()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
    });