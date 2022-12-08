import * as fs from 'node:fs';
import * as path from 'node:path';

const fsPromises = fs.promises;

export class FileHelper {

    public static async createDirectory(path: string): Promise<void> {
        await fsPromises.mkdir(path, { recursive: true });
    }

    public static async read<T = string>(location: string, contentType: 'json' = null): Promise<T> {
        const content = await fsPromises.readFile(location, { encoding: 'utf-8' });
        if (contentType === 'json') {
            return JSON.parse(content);
        }
        return content as any;
    }

    public static async writeIfNotExists(location: string, content: string): Promise<boolean> {
        if (await this.exists(location)) {
            return false;
        }
        await this.write(location, content);
        return true;
    }

    public static async write(location: string, content: string): Promise<void> {
        const parentDirectory = path.dirname(location);
        if (!await this.exists(parentDirectory)) {
            await this.createDirectory(parentDirectory);
        }
        await fsPromises.writeFile(location, content);
    }

    public static async exists(file: string): Promise<boolean> {
        return fs.existsSync(file);
    }
}
