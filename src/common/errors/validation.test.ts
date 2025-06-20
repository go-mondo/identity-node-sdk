import { describe, expect, test } from 'vitest';
import { HttpError } from './http.js';
import { ValidationError } from './validation.js';

describe('Common Errors - Validation', () => {
  describe('ValidationError', () => {
    test('should create validation error with fields', () => {
      const fields = {
        email: 'Invalid email format',
        name: 'Name is required',
      };
      const options = {
        statusCode: 400,
        type: 'ValidationError',
        fields,
      };

      const error = new ValidationError('Validation failed', options);

      expect(error.message).toBe('Validation failed');
      expect(error.statusCode).toBe(400);
      expect(error.type).toBe('ValidationError');
      expect(error.fields).toEqual(fields);
    });

    test('should inherit from HttpError', () => {
      const fields = { field: 'error' };
      const error = new ValidationError('Test', { fields });

      expect(error).toBeInstanceOf(Error);
      expect(error).toBeInstanceOf(HttpError);
      expect(error).toBeInstanceOf(ValidationError);
    });

    test('should use default HTTP error properties when not specified', () => {
      const fields = { field: 'error' };
      const error = new ValidationError('Test validation error', { fields });

      expect(error.message).toBe('Test validation error');
      expect(error.statusCode).toBe(500); // HttpError default
      expect(error.type).toBe('Unknown'); // HttpError default
      expect(error.fields).toEqual(fields);
    });

    test('should handle all HttpError options plus fields', () => {
      const options = {
        statusCode: 422,
        type: 'UnprocessableEntity',
        trace: 'validation-trace-456',
        body: { request: 'data' },
        fields: { username: 'Username already exists' },
      };

      const error = new ValidationError('Unprocessable entity', options);

      expect(error.message).toBe('Unprocessable entity');
      expect(error.statusCode).toBe(422);
      expect(error.type).toBe('UnprocessableEntity');
      expect(error.trace).toBeUndefined(); // trace is not assigned in HttpError constructor
      expect(error.body).toBeUndefined(); // body is not assigned in HttpError constructor
      expect(error.fields).toEqual({ username: 'Username already exists' });
    });

    test('should inherit isAuthorizationError from HttpError', () => {
      const fields = { field: 'error' };

      const error401 = new ValidationError('Unauthorized', {
        statusCode: 401,
        fields,
      });
      const error403 = new ValidationError('Forbidden', {
        statusCode: 403,
        fields,
      });
      const error400 = new ValidationError('Bad Request', {
        statusCode: 400,
        fields,
      });

      expect(error401.isAuthorizationError).toBe(true);
      expect(error403.isAuthorizationError).toBe(true);
      expect(error400.isAuthorizationError).toBe(false);
    });

    test('should handle empty fields object', () => {
      const error = new ValidationError('No field errors', { fields: {} });

      expect(error.fields).toEqual({});
      expect(error.message).toBe('No field errors');
    });

    test('should handle multiple field errors', () => {
      const fields = {
        email: 'Email is invalid',
        password: 'Password too short',
        confirmPassword: 'Passwords do not match',
        age: 'Must be 18 or older',
      };

      const error = new ValidationError('Multiple validation errors', {
        fields,
      });

      expect(error.fields).toEqual(fields);
      expect(Object.keys(error.fields)).toHaveLength(4);
    });
  });
});
