import { exec } from 'child_process';
import * as fs from 'fs';
import * as path from 'path';

export function executeCommand(command: string): Promise<string> {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                reject(error);
                return;
            }
            if (stderr) {
                reject(new Error(`Standard error: ${stderr}`));
                return;
            }
            const data = stdout.trim();
            resolve(data);
        });
    });
}

export function sleep(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

export function readFileJson(filePath: string): Promise<any> {
    const _filePath = path.join(__dirname, filePath);
    return new Promise((resolve, reject) => {
        fs.readFile(_filePath, 'utf8', (error, data) => {
            if (error) {
                reject(error);
                return;
            }
            try {
                const jsonData = JSON.parse(data);
                resolve(jsonData);
            } catch (error) {
                reject(error);
            }
        });
    });
}
