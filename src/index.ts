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
    await action.default();
})()
.then(() => process.exit(0))
.catch(error => {
    console.log(error);
    process.exit(1);
});