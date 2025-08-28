import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { QueryFailedError } from 'typeorm';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const timestamp = new Date().toISOString();

    // Handle known HTTP exceptions
    if (exception instanceof HttpException) {
      const status = exception.getStatus();
      const res: any = exception.getResponse();
      const message = Array.isArray(res?.message) ? res.message : res?.message || exception.message;

      return response.status(status).json({
        success: false,
        statusCode: status,
        path: request.url,
        timestamp,
        message,
        error: res?.error || exception.name,
      });
    }

    // Handle database errors (e.g., unique violation, FK violation)
    if (exception instanceof QueryFailedError) {
      // @ts-ignore
      const code: string | undefined = exception.code;
      // @ts-ignore
      const detail: string | undefined = exception.detail;

      // Unique constraint
      if (code === '23505') {
        // Try to extract field from detail: Key (email)=(user@example.com) already exists.
        const match = detail?.match(/Key \((.+)\)=\((.+)\) already exists\./);
        const field = match?.[1];
        const value = match?.[2];
        const message = field && value
          ? `Duplicate value for ${field}: ${value}`
          : 'Duplicate record violates unique constraint';

        return response.status(HttpStatus.CONFLICT).json({
          success: false,
          statusCode: HttpStatus.CONFLICT,
          path: request.url,
          timestamp,
          message,
          error: 'Conflict',
        });
      }

      // Foreign key violation
      if (code === '23503') {
        return response.status(HttpStatus.BAD_REQUEST).json({
          success: false,
          statusCode: HttpStatus.BAD_REQUEST,
          path: request.url,
          timestamp,
          message: 'Operation violates a foreign key constraint',
          error: 'Bad Request',
        });
      }

      // Fallback for other DB errors
      return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
        success: false,
        statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
        path: request.url,
        timestamp,
        message: 'Database error occurred',
        error: 'QueryFailedError',
      });
    }

    // Unknown error fallback
    return response.status(HttpStatus.INTERNAL_SERVER_ERROR).json({
      success: false,
      statusCode: HttpStatus.INTERNAL_SERVER_ERROR,
      path: request.url,
      timestamp,
      message: 'Internal server error',
      error: (exception as any)?.message || 'Error',
    });
  }
}


