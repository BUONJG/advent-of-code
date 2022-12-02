const countIncreases = (values: number[]): number => {
    let increaseCount = 0;
    values.forEach((value, index) => {
        if (index > 0 && value > values[index - 1]) {
            increaseCount++;
        }
    });

    return increaseCount;
}

export default async (input: string) => {
    const sonarValues = input.split('\n').map(v => +v);
    const cumulativeSonarValues = sonarValues.map((v, i) => i > 1 ? v + sonarValues[i - 1] + sonarValues[i - 2] : null).filter(v => v !== null);

    return [countIncreases(sonarValues), countIncreases(cumulativeSonarValues)];
}
