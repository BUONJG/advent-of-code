
import { InputParser, Tuple, _intersection, _uniq } from './helpers';

type Assignment = Tuple<number, 2>;
type PairOfAssignment = Tuple<Assignment, 2>;

const doesAssignmentFullyContainsTheOther = (pair: PairOfAssignment): boolean => {
    const [assignment1, assignment2] = pair;
    if (assignment1[0] <= assignment2[0] && assignment1[1] >= assignment2[1]) {
        return true;
    }
    if (assignment1[0] >= assignment2[0] && assignment1[1] <= assignment2[1]) {
        return true;
    }
    return false;
}

const getAssignmentSections = (assignment: Assignment): number[] => {
    return new Array(assignment[1] - assignment[0] + 1).fill(assignment[0]).map((v, i) => v + i);
}

const hasOverlap = (pair: PairOfAssignment): boolean => {
    return _intersection(...pair.map(a => getAssignmentSections(a))).length > 0;
}

const getPairOfAssignments = (input: InputParser): PairOfAssignment[] => {
    return <any>input.getLines().map(l => l.getLines(',').map(a => a.getTupleNumbers(2, '-')));
}

function part1(input: InputParser): number {
    return getPairOfAssignments(input).filter(p => doesAssignmentFullyContainsTheOther(p)).length;
}

function part2(input: InputParser): number {
    return getPairOfAssignments(input).filter(p => hasOverlap(p)).length;
}

export default async (input: InputParser) => {
    return [part1(input), part2(input)];
}