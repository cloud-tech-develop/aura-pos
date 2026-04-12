import { environment } from '@environment/environment';

/**

  SOCKET_URL: 'http://localhost:8081',

  DEFAULT_LANGUAGE: 'es',
  DEFAULT_THEME: 'dark',
  DEFAULT_CURRENCY: 'COP',
  DEFAULT_TIMEZONE: 'America/Bogota',
  DEFAULT_DATE_FORMAT: 'dd/MM/yyyy',
  DEFAULT_TIME_FORMAT: 'HH:mm:ss',
  DEFAULT_DATE_TIME_FORMAT: 'dd/MM/yyyy HH:mm:ss',
  DEFAULT_NUMBERING_FORMAT: '#,##0.00',
  DEFAULT_DECIMAL_PLACES: 2,
  DEFAULT_THOUSAND_SEPARATOR: ',',
  DEFAULT_DECIMAL_SEPARATOR: '.',
 */

export const IS_PRODUCTION = environment.PRODUCTION;
export const API_URL = environment.API_URL;
export const ATMOSPHERE = environment.ATMOSPHERE;
export const SOCKET_URL = environment.SOCKET_URL;

export const DEFAULT_LANGUAGE = environment.DEFAULT_LANGUAGE || 'es';
export const DEFAULT_THEME = environment.DEFAULT_THEME || 'dark';
export const DEFAULT_CURRENCY = environment.DEFAULT_CURRENCY || 'COP';
export const DEFAULT_TIMEZONE = environment.DEFAULT_TIMEZONE || 'America/Bogota';
export const DEFAULT_DATE_FORMAT = environment.DEFAULT_DATE_FORMAT || 'dd/MM/yyyy';
export const DEFAULT_TIME_FORMAT = environment.DEFAULT_TIME_FORMAT || 'HH:mm:ss';
export const DEFAULT_DATE_TIME_FORMAT =
  environment.DEFAULT_DATE_TIME_FORMAT || 'dd/MM/yyyy HH:mm:ss';
export const DEFAULT_NUMBERING_FORMAT = environment.DEFAULT_NUMBERING_FORMAT || '#,##0.00';
export const DEFAULT_DECIMAL_PLACES = environment.DEFAULT_DECIMAL_PLACES || 2;
export const DEFAULT_THOUSAND_SEPARATOR = environment.DEFAULT_THOUSAND_SEPARATOR || ',';
export const DEFAULT_DECIMAL_SEPARATOR = environment.DEFAULT_DECIMAL_SEPARATOR || '.';
