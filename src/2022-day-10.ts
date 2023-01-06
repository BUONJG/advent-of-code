
import { InputParser, Switch } from './helpers';

class Manager {
    private score = 0;
    private cycle = 0;
    private x = 1;

    public runInstruction(instruction: string): void {
        Switch<string, () => void>(instruction)
            .case('noop', () => this.incrementCycle())
            .case(i => i.startsWith('addx'), () => {
                this.incrementCycle();
                this.incrementCycle();
                this.x += +instruction.replace('addx ', '');
            })
            .exhaustive()();
    }

    public getScore(): number {
        return this.score;
    }

    private incrementCycle(): void {
        this.cycle++;
        if (this.isRemarkableCycle()) {
            this.score += this.x * this.cycle;
        }
    }

    private isRemarkableCycle(): boolean {
        return (this.cycle - 20) % 40 === 0;
    }
}



function part1(input: InputParser): number {
    const instructions = input.getLines().map(l => l.get());

    const manager = new Manager();

    instructions.forEach(instruction => {
        manager.runInstruction(instruction);
    });
    return manager.getScore();
}

function part2(input: InputParser): number {
    return null;
}

export default async (input: InputParser) => {
    return [part1(input), part2(input)];
}