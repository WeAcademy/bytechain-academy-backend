import {
  ArgumentsHost,
  BadRequestException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { QueryFailedError } from 'typeorm';
import {
  HttpExceptionFilter,
  isInvalidUuidError,
} from './http-exception.filter';

function run(exception: unknown) {
  const codes: number[] = [];
  const bodies: Record<string, unknown>[] = [];
  const response = {
    status: (code: number) => {
      codes.push(code);
      return { json: (body: Record<string, unknown>) => bodies.push(body) };
    },
  };
  const host = {
    switchToHttp: () => ({ getResponse: () => response }),
  } as unknown as ArgumentsHost;
  new HttpExceptionFilter().catch(exception, host);
  return { status: codes[0], body: bodies[0] };
}

const uuidError = () =>
  new QueryFailedError(
    'SELECT ...',
    [],
    new Error('invalid input syntax for type uuid: "not-a-uuid"'),
  );

describe('HttpExceptionFilter', () => {
  beforeEach(() => {
    jest.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);
  });
  afterEach(() => jest.restoreAllMocks());

  it('keeps the status and message of HTTP exceptions', () => {
    expect(run(new NotFoundException('Lesson not found'))).toMatchObject({
      status: 404,
      body: { statusCode: 404, message: 'Lesson not found' },
    });
    const bad = run(new BadRequestException(['name must not be empty']));
    expect(bad.status).toBe(400);
    expect(bad.body.message).toEqual(['name must not be empty']);
  });

  it('turns an invalid-UUID database error into 404, not 500', () => {
    expect(run(uuidError())).toMatchObject({
      status: 404,
      body: { statusCode: 404, message: 'Resource not found' },
    });
  });

  it('only maps that specific error: other database errors stay 500', () => {
    const other = new QueryFailedError(
      'SELECT ...',
      [],
      new Error('relation "x" does not exist'),
    );
    expect(isInvalidUuidError(other)).toBe(false);
    expect(run(other)).toMatchObject({
      status: 500,
      body: { message: 'Internal server error' },
    });
    expect(run(new Error('boom')).status).toBe(500);
  });

  it('never leaks the database message in the response', () => {
    expect(JSON.stringify(run(uuidError()).body)).not.toContain('not-a-uuid');
  });
});
