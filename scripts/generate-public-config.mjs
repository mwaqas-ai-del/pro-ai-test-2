import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const envPath = resolve(rootDir, '.env');
const outputPath = resolve(rootDir, 'public/app-config.js');

function parseEnv(contents) {
  return contents
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('#'))
    .reduce((acc, line) => {
      const separatorIndex = line.indexOf('=');
      if (separatorIndex === -1) return acc;
      const key = line.slice(0, separatorIndex).trim();
      let value = line.slice(separatorIndex + 1).trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      acc[key] = value;
      return acc;
    }, {});
}

const fileEnv = existsSync(envPath) ? parseEnv(readFileSync(envPath, 'utf8')) : {};
const env = { ...fileEnv, ...process.env };

const requiredKeys = [
  'VITE_SUPABASE_URL',
  'VITE_SUPABASE_ANON_KEY',
  'VITE_AI_TEST_CHECKER_WEBHOOK_URL',
];

const missingKeys = requiredKeys.filter((key) => !env[key]);
if (missingKeys.length) {
  throw new Error(`Missing required environment variables: ${missingKeys.join(', ')}`);
}

const publicConfig = {
  supabaseUrl: env.VITE_SUPABASE_URL,
  supabaseAnonKey: env.VITE_SUPABASE_ANON_KEY,
  aiTestCheckerWebhookUrl: env.VITE_AI_TEST_CHECKER_WEBHOOK_URL,
};

mkdirSync(dirname(outputPath), { recursive: true });
writeFileSync(
  outputPath,
  `window.__PROBATION_TEST_CONFIG__ = ${JSON.stringify(publicConfig, null, 2)};\n`,
);
