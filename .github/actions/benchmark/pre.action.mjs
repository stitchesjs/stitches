import { spawn } from 'child_process';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

spawn('npm', ['install'], { cwd: __dirname, stdio: 'inherit' });
