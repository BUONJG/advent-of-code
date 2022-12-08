import readLine = require('readline');

const rl = readLine.createInterface({ input: process.stdin, output: process.stdout });

export class IoHelper {
    public static async ask(question: string, flag: string = null): Promise<string> {
        if (this.hasOption(flag)) {
            return this.getOption(flag);
        }
        return new Promise<string>(resolve => {
            rl.question(question, r => resolve(<any>r));
        });
    }

    public static async askYesNo(question: string, flag: string = null): Promise<boolean> {
        const response = await this.ask(`${question} (Y|N)`, flag);

        if (['y', 'yes', 'true', 'on', '1'].includes(response?.toLowerCase())) {
            return true;
        }

        if (['n', 'no', 'false', 'off', '0'].includes(response?.toLowerCase())) {
            return false;
        }

        return response.toLowerCase() === 'y';
    }

    public static async askSelect<T>(question: string, options: { value: T, label: string }[], flag: string = null): Promise<T> {
        let index: number;
        if (this.hasOption(flag)) {
            index = parseInt(this.getOption(flag), 10);
        } else {
            console.log(question);
            options.forEach((option, index) => {
                console.log(`${index}: ${option.label}`);
            });

            index = parseInt(await this.ask('Your choice: ', flag), 10);
        }

        return options[index] ? options[index].value : null;
    }

    public static hasOption(flag: string): boolean {
        return flag && process.argv.findIndex(arg => arg === flag) !== -1;
    }

    public static getOption(flag: string): string {
        const index = process.argv.findIndex(arg => arg === flag);
        if (index >= 0 && process.argv[index + 1]) {
            return process.argv[index + 1];
        }

        return null;
    }
}
