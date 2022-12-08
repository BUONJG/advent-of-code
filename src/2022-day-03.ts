
import { assert, InputParser, Switch, _chunk, _flatMapDeep, _intersection, _sumBy } from './helpers';

const getItemPriority = (item: string): number => {
    return Switch<string, number>(item)
        .case(i => i === i.toLowerCase(), item.charCodeAt(0) - 96)
        .case(i => i === i.toUpperCase(), item.charCodeAt(0) - 38)
        .exhaustive();
}

const getCommonItem = (compartiments: string[][]): string => {
    const intersection = _intersection(...compartiments);
    assert(intersection.length === 1, 'Only one item should be in common!');
    return _intersection(...compartiments)[0];
}

const getCompartimentedItems = (items: string): [string[], string[]] => {
    const chunks = _chunk(items, items.length / 2);
    assert(chunks.length === 2, 'Items should be compatimented into two parts!');
    return [chunks[0], chunks[1]];
}

const getItems = (items: string): string[] => {
    return _flatMapDeep(_chunk(items, 1));
}

function part1(input: InputParser): number {
    const rucksackCommonItems = input.getValues().flatMap(r => getCommonItem(getCompartimentedItems(r)));
    return _sumBy(rucksackCommonItems, i => getItemPriority(i));
}

function part2(input: InputParser): number {
    const groups = _chunk(input.getValues(), 3);
    const badges = groups.map(group => getCommonItem(group.map(items => getItems(items))));
    return _sumBy(badges, badge => getItemPriority(badge));
}

export default async (input: InputParser) => {
    return [part1(input), part2(input)];
}