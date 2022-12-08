
import { _chunk, _uniq } from './helpers';
import { InputParser } from './helpers';

const isStartOfPacketMarker = (buffer: string): boolean => {
    return buffer.length === 4 && _uniq(buffer).length === 4;
}

const isStartOfMessageMarker = (buffer: string): boolean => {
    return buffer.length === 14 && _uniq(buffer).length === 14;
}

function part1(input: InputParser): number {
    const datastream = input.get();

    let position = 0; let marker: string;
    do {
        marker = datastream.substring(position, position + 4);
        position++;
    } while (!isStartOfPacketMarker(marker));

    return position + 3;
}

function part2(input: InputParser): number {
    const datastream = input.get();

    let position = 0; let marker: string;
    do {
        marker = datastream.substring(position, position + 14);
        position++;
    } while (!isStartOfMessageMarker(marker));

    return position + 13;
}

export default async (input: InputParser) => {
    return [part1(input), part2(input)];
}