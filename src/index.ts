import { IoHelper, FileHelper, PromiseHelper, InputParser } from './helpers';

const getUserSession = async (): Promise<string> => {
    const location = `./data/.session`;
    if (!await FileHelper.exists(location)) {
        await FileHelper.write(location, await IoHelper.ask('Please enter your user session: '));
    }

    return FileHelper.read(location);
}

const getInput = async (year: number | string, day: number | string): Promise<string> => {
    const session = await getUserSession();
    const response = await fetch(`https://adventofcode.com/${year}/day/${+day}/input`, {
        headers: {
            cookie: `session=${session};`
        }
    });
    return response.text();
}

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
    if (!await FileHelper.exists(inputLocation)) {
        await FileHelper.write(inputLocation, await getInput(year, day));
    }
    if (await FileHelper.writeIfNotExists(scriptLocation, await FileHelper.read(templateLocation))) {
        await PromiseHelper.wait(2);
    }

    const action = await import(`./${year}-day-${day}`);
    const controlInput = await FileHelper.read(controlLocation);
    if (!controlInput) {
        throw new Error(`Please complete control input in ${controlLocation}`);
    }
    const controlSolutions = await action.default(new InputParser(controlInput));

    if (!Array.isArray(controlSolutions) || controlSolutions.length !== 2) {
        throw new Error(`Incorrect response (array expected)!`);
    }

    const expectedSolutions = await FileHelper.read<(string | number)[]>(solutionLocation, 'json');
    for (let index = 0; index < expectedSolutions.length; index++) {
        if (!expectedSolutions[index]) {
            const solution = await IoHelper.ask(`Please enter part ${index + 1} control solution: `);
            expectedSolutions[index] = ('' + (+solution)) === solution ? +solution : solution;
            await FileHelper.write(solutionLocation, JSON.stringify(expectedSolutions, null, 4));
        }
        if (expectedSolutions[index] !== controlSolutions[index]) {
            throw new Error(`Solution ${index + 1} is wrong: expected = ${expectedSolutions[index]} / response = ${controlSolutions[index]}`);
        }
    }

    const input = await FileHelper.read(inputLocation);
    if (!input) {
        throw new Error(`Please set your input in ${inputLocation}`);
    }

    const solutions: number[] = await action.default(new InputParser(input));
    solutions.forEach((solution, index) => {
        console.log(`Solution ${index + 1}: ${solution ?? 'Not implemented yet...'}`);
    });
}

const executeAll = async (): Promise<void> => {
    for (let year = 2015; year <= new Date().getFullYear(); year++) {
        for (let day = 1; day <= 25; day++) {
            await execute(year, day);
        }
    }
}

(async () => {
    if (IoHelper.hasOption('-a')) {
        return executeAll();
    }

    const year = await IoHelper.ask('Event year: ', '-y');
    const day = await IoHelper.ask('Day: ', '-d');
    return execute(year, day, true);
})()
    .then(() => process.exit(0))
    .catch(error => {
        console.log(error);
        process.exit(1);
    });