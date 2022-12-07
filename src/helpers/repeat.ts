export const repeat = (n: number, callback: (i: number) => void): void => {
    for (let i = 0; i < n; i++) {
        callback(i);
    }
}
