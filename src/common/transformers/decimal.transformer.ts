import type { ValueTransformer } from 'typeorm';

/**
 * PostgreSQL returns `decimal`/`numeric` columns as strings ("100.00") to avoid
 * losing precision, whereas SQLite returned numbers. This transformer gives
 * entity properties declared as `number` the number they promise.
 *
 * Use it only for values where a JavaScript number is precise enough (such as a
 * percentage score), never for money.
 */
export const decimalToNumber: ValueTransformer = {
  to: (value: number | null | undefined) => value,
  from: (value: string | number | null | undefined) =>
    value === null || value === undefined ? value : Number(value),
};
