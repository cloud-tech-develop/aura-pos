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
  SOCKET_URL: '${process.env['SOCKET_URL'] || 'http://localhost:3000'}',
  DEFAULT_LANGUAGE: '${process.env['DEFAULT_LANGUAGE'] || 'es'}',
  DEFAULT_THEME: '${process.env['DEFAULT_THEME'] || 'dark'}',
  DEFAULT_CURRENCY: '${process.env['DEFAULT_CURRENCY'] || 'COP'}',
  DEFAULT_TIMEZONE: '${process.env['DEFAULT_TIMEZONE'] || 'America/Bogota'}',
  DEFAULT_DATE_FORMAT: '${process.env['DEFAULT_DATE_FORMAT'] || 'dd/MM/yyyy'}',
  DEFAULT_TIME_FORMAT: '${process.env['DEFAULT_TIME_FORMAT'] || 'HH:mm:ss'}',
  DEFAULT_DATE_TIME_FORMAT: '${process.env['DEFAULT_DATE_TIME_FORMAT'] || 'dd/MM/yyyy HH:mm:ss'}',
  DEFAULT_DECIMAL_PLACES: '${process.env['DEFAULT_DECIMAL_PLACES'] || 2}',
};
`;

const dir = path.dirname(targetPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(targetPath, envConfig);
fs.writeFileSync(targetProdPath, envConfig.replace('production: false', 'production: true'));

console.log('Environment files generated successfully!');
