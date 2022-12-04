export const assert = (value: boolean, message = 'An error occurred!'): void => {
    if (!value) {
        throw new Error(message);
    }
}