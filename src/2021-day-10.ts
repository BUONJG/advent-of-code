
import { assert, InputParser, Switch, _sum } from './helpers';

type OpeningCharacter = '(' | '{' | '[' | '<';
type ClosingCharacter = ')' | '}' | ']' | '>';
type Character = OpeningCharacter | ClosingCharacter;

class InvalidClosingCharacterError extends Error {
    constructor(public closingCharacter: ClosingCharacter) {
        super('InvalidClosingCharacterError');
    }
}

const isOpeningCharacter = (character: Character): boolean => {
    return ['(', '{', '[', '<'].includes(character);
}

const getClosingCharacter = (character: OpeningCharacter): ClosingCharacter => {
    return Switch<OpeningCharacter, ClosingCharacter>(character)
        .case('(', ')')
        .case('[', ']')
        .case('{', '}')
        .case('<', '>')
        .exhaustive()
}

const getCorruptedCharacterPoints = (character: ClosingCharacter): number => {
    return Switch<ClosingCharacter, number>(character)
        .case(')', 3)
        .case(']', 57)
        .case('}', 1197)
        .case('>', 25137)
        .exhaustive()
}

const getClosingCharacterPoints = (character: ClosingCharacter): number => {
    return Switch<ClosingCharacter, number>(character)
        .case(')', 1)
        .case(']', 2)
        .case('}', 3)
        .case('>', 4)
        .exhaustive()
}

const getCorruptedCharacter = (characters: Character[]): ClosingCharacter => {
    try {
        getMissingClosingCharacters(characters);
        return null;
    } catch (error) {
        if (error instanceof InvalidClosingCharacterError) {
            return error.closingCharacter;
        }
        throw error;
    }
}

const getMissingClosingCharacters = (characters: Character[]): ClosingCharacter[] => {
    const openedChunks: OpeningCharacter[] = [];

    for (const character of characters) {
        if (isOpeningCharacter(character)) {
            openedChunks.push(character as OpeningCharacter);
        } else if (character !== getClosingCharacter(openedChunks.at(-1))) {
            throw new InvalidClosingCharacterError(character as ClosingCharacter)
        } else {
            openedChunks.pop();
        }
    }

    return openedChunks.reverse().map(c => getClosingCharacter(c));
}

const isCorrupted = (characters: Character[]): boolean => {
    return !!getCorruptedCharacter(characters);
}

const isIncomplete = (characters: Character[]): boolean => {
    return !isCorrupted(characters) && getMissingClosingCharacters(characters).length > 0;
}

function part1(input: InputParser): number {
    const lines = input.getLines().map(l => l.getCharacters<Character>());
    const corruptedLines = lines.filter(l => isCorrupted(l));

    const corruptedCharacters = corruptedLines.map(l => getCorruptedCharacter(l));

    return _sum(corruptedCharacters.map(c => getCorruptedCharacterPoints(c)));
}

function part2(input: InputParser): number {
    const lines = input.getLines().map(l => l.getCharacters<Character>());
    const incompleteLines = lines.filter(l => isIncomplete(l));

    const linePoints = incompleteLines.map(l => getMissingClosingCharacters(l).reduce((t, c) => getClosingCharacterPoints(c) + 5 * t, 0));
    return linePoints.sort((a, b) => a < b ? 1 : -1).at(linePoints.length / 2);
}

export default async (input: InputParser) => {
    return [part1(input), part2(input)];
}
