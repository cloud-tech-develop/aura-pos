import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load .env file
dotenv.config();

const targetPath = path.join(__dirname, '../src/environments/environment.ts');
const targetProdPath = path.join(__dirname, '../src/environments/environment.prod.ts');

const envConfig = `
export const environment = {
  PRODUCTION: ${process.env['ATMOSPHERE'] === 'production'},
  API_URL: '${process.env['API_URL'] || 'http://localhost:8080'}',
  ATMOSPHERE: '${process.env['ATMOSPHERE'] || 'development'}',
};
`;

const dir = path.dirname(targetPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(targetPath, envConfig);
fs.writeFileSync(targetProdPath, envConfig.replace('production: false', 'production: true'));

console.log('Environment files generated successfully!');
