import axios from 'axios';
import https from 'https';
// import {debug} from './logger';

/**
 *
 * @param key
 */
export function requireEnv(key) {
  let value = process.env[key];
  if (!value) {
    throw new Error(`Environment is missing ${key}.`);
  }
  return value;
}

/**
 *
 * @returns {boolean}
 */
export function isDebug() {
  let value = requireEnv('DEBUG');
  return value === 'true';
}

/**
 *
 * @returns {boolean}
 */
export function skipSSL() {
  if (isDebug()) {
    return true;
  }

  let value = requireEnv('SKIP_SSL');
  return value === 'true';
}

/**
 *
 * @returns {*}
 */
export function getAxiosBaseClient() {
  let client;
  const baseURL = requireEnv('API_URL');
  if (skipSSL()) {
    client = axios.create({
      baseURL: baseURL,
      httpsAgent: new https.Agent({
        rejectUnauthorized: false,
      }),
    });
  } else {
    client = axios.create({
      baseURL: baseURL,
    });
  }

  return client;
}
