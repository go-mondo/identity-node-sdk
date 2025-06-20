import { describe, expect, test } from 'vitest';
import { HttpError } from './http.js';

describe('Common Errors - HTTP', () => {
  describe('HttpError', () => {
    test('should create error with default message and status', () => {
      const error = new HttpError();

      expect(error.message).toBe(
        'An unknown error occurred. Please try the operation again.'
      );
      expect(error.statusCode).toBe(500);
      expect(error.type).toBe('Unknown');
      expect(error.trace).toBeUndefined();
      expect(error.body).toBeUndefined();
    });

    test('should create error with custom message', () => {
      const error = new HttpError('Custom error message');

      expect(error.message).toBe('Custom error message');
      expect(error.statusCode).toBe(500);
      expect(error.type).toBe('Unknown');
    });

    test('should create error with custom options', () => {
      const options = {
        statusCode: 404,
        type: 'NotFound',
        trace: 'trace-123',
        body: { resource: 'user' },
      };

      const error = new HttpError('Resource not found', options);

      expect(error.message).toBe('Resource not found');
      expect(error.statusCode).toBe(404);
      expect(error.type).toBe('NotFound');
      expect(error.trace).toBeUndefined(); // trace is not assigned in constructor
      expect(error.body).toBeUndefined(); // body is not assigned in constructor
    });

    test('should handle partial options', () => {
      const error = new HttpError('Test error', { statusCode: 400 });

      expect(error.message).toBe('Test error');
      expect(error.statusCode).toBe(400);
      expect(error.type).toBe('Unknown');
      expect(error.trace).toBeUndefined();
      expect(error.body).toBeUndefined();
    });

    test('should be instance of Error', () => {
      const error = new HttpError();
      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(HttpError);
    });

    describe('isAuthorizationError', () => {
      test('should return true for 401 status', () => {
        const error = new HttpError('Unauthorized', { statusCode: 401 });
        expect(error.isAuthorizationError).toBe(true);
      });

      test('should return true for 403 status', () => {
        const error = new HttpError('Forbidden', { statusCode: 403 });
        expect(error.isAuthorizationError).toBe(true);
      });

      test('should return false for other status codes', () => {
        const error400 = new HttpError('Bad Request', { statusCode: 400 });
        const error404 = new HttpError('Not Found', { statusCode: 404 });
        const error500 = new HttpError('Internal Error', { statusCode: 500 });

        expect(error400.isAuthorizationError).toBe(false);
        expect(error404.isAuthorizationError).toBe(false);
        expect(error500.isAuthorizationError).toBe(false);
      });

      test('should return false for default status code', () => {
        const error = new HttpError();
        expect(error.isAuthorizationError).toBe(false);
      });
    });
  });
});
