import 'reflect-metadata';
import { join } from 'node:path';
import { DataSource } from 'typeorm';
import { buildDatabaseOptions } from './database.config';

// Used by the TypeORM CLI (see the migration:* scripts in package.json). The
// Nest app reads the same variables through ConfigModule. The environment wins
// over .env, like ConfigModule.
try {
  process.loadEnvFile('.env');
} catch {
  // No .env file: rely on the real environment.
}

const env = process.env;

export default new DataSource({
  ...buildDatabaseOptions({
    DB_HOST: env.DB_HOST ?? 'localhost',
    DB_PORT: env.DB_PORT ?? 5432,
    DB_USERNAME: env.DB_USERNAME ?? 'postgres',
    DB_PASSWORD: env.DB_PASSWORD ?? '',
    DB_NAME: env.DB_NAME ?? 'bytechain',
    DB_SSL: env.DB_SSL,
  }),
  // Works from src/ (ts-node) and from dist/ (compiled): same relative layout.
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
});
