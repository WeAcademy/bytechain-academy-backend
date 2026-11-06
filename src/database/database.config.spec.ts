import { buildDatabaseOptions } from './database.config';

const env = {
  DB_HOST: 'db.internal',
  DB_PORT: '5433',
  DB_USERNAME: 'app',
  DB_PASSWORD: 's3cret',
  DB_NAME: 'bytechain',
};

describe('buildDatabaseOptions', () => {
  it('builds a PostgreSQL connection from the DB_* variables', () => {
    expect(buildDatabaseOptions(env)).toMatchObject({
      type: 'postgres',
      host: 'db.internal',
      port: 5433, // a number, even though env values are strings
      username: 'app',
      password: 's3cret',
      database: 'bytechain',
    });
  });

  it('accepts a numeric port too', () => {
    expect(buildDatabaseOptions({ ...env, DB_PORT: 5432 }).port).toBe(5432);
  });

  it('never synchronizes the schema: migrations are the only way', () => {
    expect(buildDatabaseOptions(env).synchronize).toBe(false);
    expect(buildDatabaseOptions({ ...env, DB_SSL: true }).synchronize).toBe(
      false,
    );
  });

  it('uses the built-in gen_random_uuid() so no extension is needed', () => {
    const options = buildDatabaseOptions(env);
    expect(options.uuidExtension).toBe('pgcrypto');
    expect(options.installExtensions).toBe(false);
  });

  it('enables TLS only when asked, accepting the boolean or the string', () => {
    expect(buildDatabaseOptions(env)).not.toHaveProperty('ssl');
    expect(buildDatabaseOptions({ ...env, DB_SSL: false })).not.toHaveProperty(
      'ssl',
    );
    expect(
      buildDatabaseOptions({ ...env, DB_SSL: 'false' }),
    ).not.toHaveProperty('ssl');
    expect(buildDatabaseOptions({ ...env, DB_SSL: true })).toMatchObject({
      ssl: true,
    });
    expect(buildDatabaseOptions({ ...env, DB_SSL: 'true' })).toMatchObject({
      ssl: true,
    });
  });

  it('does not use SQLite anywhere', () => {
    const options = JSON.stringify(buildDatabaseOptions(env));
    expect(options).not.toMatch(/sqlite/i);
  });
});
