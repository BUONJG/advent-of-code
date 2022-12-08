
import { InputParser, repeat, Switch, _min, _sum, _take } from './helpers';

type Directory = string[];

class Output {
    constructor(private output: string) {
    }

    public isCommand(): boolean {
        return this.output.startsWith('$');
    }

    public getWorkingDirectory(workingDirectory: Directory): Directory {
        return Switch<string, Directory>(this.output)
            .case('$ cd ..', _take(workingDirectory, workingDirectory.length - 1))
            .case(o => o.startsWith('$ cd '), [...workingDirectory, this.output.replace('$ cd ', '')])
            .default(workingDirectory);
    }

    public isDirectory(): boolean {
        return this.output.startsWith('dir ');
    }

    public getFileSize(): number {
        if (this.isCommand() || this.isDirectory()) {
            return 0;
        }

        return +this.output.split(' ')[0];
    }
}

const getDirectorySizes = (terminalOutputs: Output[]): Map<string, number> => {
    let workingDirectory = []; let directorySizes = new Map<string, number>();
    terminalOutputs.forEach(o => {
        workingDirectory = o.getWorkingDirectory(workingDirectory);

        repeat(workingDirectory.length, l => {
            const directory = _take(workingDirectory, l + 1).join('/');
            directorySizes.set(directory, (directorySizes.get(directory) ?? 0) + o.getFileSize());
        });
    });

    return directorySizes;
}

function part1(input: InputParser): number {
    const terminalOutputs = input.getLines().map(l => new Output(l.get<string>()));
    const directorySizes = getDirectorySizes(terminalOutputs);
    return _sum(Array.from(directorySizes.values()).filter(s => s <= 100000));
}

function part2(input: InputParser): number {
    const terminalOutputs = input.getLines().map(l => new Output(l.get<string>()));
    const directorySizes = getDirectorySizes(terminalOutputs);

    const freeSpace = 70000000 - directorySizes.get('/');
    const neededSpace = 30000000 - freeSpace;

    return _min(Array.from(directorySizes.values()).filter(s => s >= neededSpace));
}

export default async (input: InputParser) => {
    return [part1(input), part2(input)];
}