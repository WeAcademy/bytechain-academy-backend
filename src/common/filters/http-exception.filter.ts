import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Response } from 'express';
import { QueryFailedError } from 'typeorm';

/**
 * PostgreSQL rejects an id that is not a valid UUID with an error (SQLite
 * accepted anything). Such an id can never match a record, so it is a plain
 * "not found", not a server error.
 */
export function isInvalidUuidError(exception: unknown): boolean {
  return (
    exception instanceof QueryFailedError &&
    /invalid input syntax for type uuid/i.test(exception.message)
  );
}

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | string[] = 'Internal server error';

    if (isInvalidUuidError(exception)) {
      statusCode = HttpStatus.NOT_FOUND;
      message = 'Resource not found';
    } else if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (typeof exceptionResponse === 'string') {
        message = exceptionResponse;
      } else if (
        typeof exceptionResponse === 'object' &&
        exceptionResponse !== null
      ) {
        const res = exceptionResponse as Record<string, unknown>;
        if (res.message) {
          message = res.message as string | string[];
        } else {
          message = exception.message;
        }
      }
    }

    this.logger.error(
      `${statusCode} - ${Array.isArray(message) ? message.join(', ') : message}`,
      exception instanceof Error ? exception.stack : undefined,
    );

    response.status(statusCode).json({
      statusCode,
      message,
      timestamp: new Date().toISOString(),
    });
  }
}
