import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';
import { ZodError } from 'zod';
import { AppError } from '../errors/AppError.js';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    if (exception instanceof ZodError) {
      response.status(HttpStatus.BAD_REQUEST).json({
        statusCode: HttpStatus.BAD_REQUEST,
        code: 'VALIDATION_ERROR',
        message: 'Validation failed',
        details: exception.flatten(),
      });
      return;
    }

    if (exception instanceof AppError) {
      response.status(exception.statusCode).json({
        statusCode: exception.statusCode,
        code: exception.code,
        message: exception.message,
        ...(exception.details !== undefined && { details: exception.details }),
      });
      return;
    }

    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const exceptionResponse = exception.getResponse();

      if (status === HttpStatus.UNAUTHORIZED) {
        response.status(status).json({
          statusCode: status,
          code: 'UNAUTHORIZED',
          message: typeof exceptionResponse === 'object' && 'message' in exceptionResponse
            ? String((exceptionResponse as Record<string, unknown>).message)
            : 'Unauthorized',
        });
        return;
      }

      if (status === HttpStatus.FORBIDDEN) {
        response.status(status).json({
          statusCode: status,
          code: 'FORBIDDEN',
          message: typeof exceptionResponse === 'object' && 'message' in exceptionResponse
            ? String((exceptionResponse as Record<string, unknown>).message)
            : 'Forbidden',
        });
        return;
      }

      response.status(status).json({
        statusCode: status,
        code: 'HTTP_ERROR',
        message: typeof exceptionResponse === 'object' && 'message' in exceptionResponse
          ? String((exceptionResponse as Record<string, unknown>).message)
          : exception.message,
      });
      return;
    }

    const status = HttpStatus.INTERNAL_SERVER_ERROR;
    const message = exception instanceof Error ? exception.message : 'Internal server error';

    response.status(status).json({
      statusCode: status,
      code: 'INTERNAL_ERROR',
      message: 'Internal server error',
      ...(process.env.NODE_ENV !== 'production' && { stack: exception instanceof Error ? exception.stack : undefined, error: message }),
    });
  }
}
