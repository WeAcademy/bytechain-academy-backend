import type { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

/** The database settings, read from the environment (DB_HOST, DB_PORT, ...). */
export interface DatabaseEnv {
  DB_HOST: string;
  DB_PORT: number | string;
  DB_USERNAME: string;
  DB_PASSWORD: string;
  DB_NAME: string;
  DB_SSL?: boolean | string;
}

const truthy = (value: boolean | string | undefined): boolean =>
  value === true || value === 'true';

/**
 * PostgreSQL connection options shared by the Nest app and the TypeORM CLI, so
 * the application and its migrations always talk to the database the same way.
 *
 * `synchronize` is permanently false: the schema changes only through
 * migrations (`npm run migration:run`), never by the app rewriting tables on
 * startup.
 */
export function buildDatabaseOptions(
  env: DatabaseEnv,
): PostgresConnectionOptions {
  return {
    type: 'postgres',
    host: env.DB_HOST,
    port: Number(env.DB_PORT),
    username: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    // `true` makes the driver verify the server certificate (managed hosts).
    ...(truthy(env.DB_SSL) ? { ssl: true } : {}),
    // gen_random_uuid() is built into Postgres 13+, so uuid primary keys need
    // no extension (TypeORM would otherwise ask for uuid-ossp).
    uuidExtension: 'pgcrypto',
    installExtensions: false,
    synchronize: false,
  };
}
