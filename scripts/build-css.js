import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '../src/styles');
const distDir = path.join(__dirname, '../dist/styles');

try {
    // fs.cpSync handles recursive copying and directory creation
    fs.cpSync(srcDir, distDir, {
        recursive: true,
        filter: (src) => {
            // Keep directories (to keep searching) or .css files
            const isDir = fs.lstatSync(src).isDirectory();
            const isCss = src.endsWith('.css');
            return isDir || isCss;
        }
    });
    console.log('✓ Successfully mirrored styles to dist/styles');
} catch (err) {
    console.error('✗ Error copying styles:', err);
}