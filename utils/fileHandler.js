import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const mimeTypes = {
    '.html': 'text/html',
    '.js': 'text/javascript',
    '.css': 'text/css',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpg',
};

export const getPublicPath = () => {
    return path.join(__dirname, '../public');
};

export const serveFile = (filePath, res, callback) => {
    fs.readFile(filePath, (error, content) => {
        if (callback) {
            callback(error, content);
        }
    });
};

export const getContentType = (filePath) => {
    const extname = String(path.extname(filePath)).toLowerCase();
    return mimeTypes[extname] || 'application/octet-stream';
};
