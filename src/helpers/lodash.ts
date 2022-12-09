export {
    sum as _sum,
    sortBy as _sortBy,
    flatMapDeep as _flatMapDeep,
    min as _min,
    max as _max,
    zip as _zip,
    chunk as _chunk,
    intersection as _intersection,
    sumBy as _sumBy,
    uniq as _uniq,
    uniqBy as _uniqBy,
    isEqual as _isEqual,
    compact as _compact,
    take as _take
} from 'lodash';

export const _numbers = (from: number, to: number): number[] => {
    const result: number[] = [];
    for (let i = from; i <= to; i++) {
        result.push(i);
    }

    return result;
}