import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';

// Load .env file (locally). In Dokploy, vars come from process.env automatically
// Also try .env.production for Dokploy deployments
dotenv.config({ path: path.join(__dirname, '../.env.production'), override: true });
dotenv.config({ override: false });

function getEnv(key: string, fallback: string): string {
  return process.env[key] || fallback;
}

const targetPath = path.join(__dirname, '../src/environments/environment.ts');
const targetProdPath = path.join(__dirname, '../src/environments/environment.prod.ts');

const isProduction = getEnv('ATMOSPHERE', 'development') === 'production';

const envConfig = `export const environment = {
  PRODUCTION: ${isProduction},
  API_URL: '${getEnv('API_URL', 'http://localhost:8081')}',
  ATMOSPHERE: '${getEnv('ATMOSPHERE', 'development')}',
  SOCKET_URL: '${getEnv('SOCKET_URL', 'http://localhost:3000')}',
  DEFAULT_LANGUAGE: '${getEnv('DEFAULT_LANGUAGE', 'es')}',
  DEFAULT_THEME: '${getEnv('DEFAULT_THEME', 'dark')}',
  DEFAULT_CURRENCY: '${getEnv('DEFAULT_CURRENCY', 'COP')}',
  DEFAULT_TIMEZONE: '${getEnv('DEFAULT_TIMEZONE', 'America/Bogota')}',
  DEFAULT_DATE_FORMAT: '${getEnv('DEFAULT_DATE_FORMAT', 'dd/MM/yyyy')}',
  DEFAULT_TIME_FORMAT: '${getEnv('DEFAULT_TIME_FORMAT', 'HH:mm:ss')}',
  DEFAULT_DATE_TIME_FORMAT: '${getEnv('DEFAULT_DATE_TIME_FORMAT', 'dd/MM/yyyy HH:mm:ss')}',
  DEFAULT_DECIMAL_PLACES: '${getEnv('DEFAULT_DECIMAL_PLACES', '2')}',
};
`;

const dir = path.dirname(targetPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

fs.writeFileSync(targetPath, envConfig);

const envConfigProd = envConfig.replace('PRODUCTION: false', 'PRODUCTION: true');
fs.writeFileSync(targetProdPath, envConfigProd);

console.log('Environment files generated successfully!');
