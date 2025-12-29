/* eslint-disable prettier/prettier */
import { HttpStatus } from '@nestjs/common';

export interface ExtractedError {
  message: string;
  statusCode: number;
}

/**
 * Safely extracts error message and status code from various error formats
 * Handles RPC errors, HttpExceptions, and standard Error objects
 */
export function extractErrorMessage(error: any): ExtractedError {
  // Debug log to see the actual error structure
  console.log('[Error Debug] Raw error:', JSON.stringify(error, null, 2));

  // For NestJS RPC/microservice errors, the response can be a string directly
  // Error format: { response: 'Invalid email or password', status: 401 }
  let message = 'An error occurred';

  if (typeof error?.response === 'string') {
    // RPC error with string response: { response: 'message', status: 401 }
    message = error.response;
  } else if (typeof error?.message === 'string') {
    // Standard Error object: { message: 'something' }
    message = error.message;
  } else if (error?.response?.message) {
    // HttpException with object response: { response: { message: 'msg' } }
    message = error.response.message;
  } else if (error?.data?.message) {
    // Axios-style error: { data: { message: 'msg' } }
    message = error.data.message;
  }

  // Extract status code
  const statusCode =
    error?.status ||
    error?.statusCode ||
    error?.response?.statusCode ||
    HttpStatus.INTERNAL_SERVER_ERROR;

  return {
    message: String(message),
    statusCode:
      typeof statusCode === 'number'
        ? statusCode
        : HttpStatus.INTERNAL_SERVER_ERROR,
  };
}
