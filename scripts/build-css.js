import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// In ES modules, __dirname isn't available by default, so we recreate it
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '../src/styles');
const distDir = path.join(__dirname, '../dist/styles');

if (!fs.existsSync(distDir)){
    fs.mkdirSync(distDir, { recursive: true });
}

fs.readdirSync(srcDir).forEach(file => {
    if (file.endsWith('.css')) {
        fs.copyFileSync(path.join(srcDir, file), path.join(distDir, file));
        console.log(`✓ Copied ${file} to dist/styles`);
    }
});