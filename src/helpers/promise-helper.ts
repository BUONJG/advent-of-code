export class PromiseHelper {
    private static counter = 0;

    // Used to avoid syncronous Promise resolution
    // That way other callbacks in the application can have an opportunity to get executed
    public static async from<T>(value: T): Promise<T> {
        return new Promise<T>(resolve => {
            setTimeout(() => resolve(value), 0);
        });
    }

    // Same as from function
    // use setTimeout every 100 execution to avoid performance issues
    public static async fromFaster<T>(value: T): Promise<T> {
        this.counter++;
        if (this.counter % 100 === 0) {
            this.counter = 0;
            return new Promise<T>(resolve => {
                setTimeout(() => resolve(value), 0);
            });
        } else {
            return value;
        }
    }

    public static async wait(seconds: number): Promise<void> {
        await new Promise<void>(resolve => setTimeout(() => resolve(), seconds * 1000));
    }
}
