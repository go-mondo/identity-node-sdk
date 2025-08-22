import { type } from 'arktype';
import { describe, expect, test } from 'vitest';
import { PaginationSchema } from './pagination.js';

describe('Common Schema - Pagination', () => {
  describe('PaginationSchema', () => {
    test('should accept valid pagination with pageSize as string', () => {
      const result = PaginationSchema({
        pageSize: '10',
        nextToken: 'token123',
      });

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual({
        pageSize: '10',
        nextToken: 'token123',
      });
    });

    test('should accept valid pagination with pageSize as number', () => {
      const result = PaginationSchema({
        pageSize: 20,
        nextToken: 'token456',
      });

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual({
        pageSize: 20,
        nextToken: 'token456',
      });
    });

    test('should accept pagination with only pageSize', () => {
      const result = PaginationSchema({
        pageSize: '15',
      });

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual({
        pageSize: '15',
      });
    });

    test('should accept pagination with only nextToken', () => {
      const result = PaginationSchema({
        nextToken: 'token789',
      });

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual({
        nextToken: 'token789',
      });
    });

    test('should accept empty pagination object', () => {
      const result = PaginationSchema({});

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual({});
    });

    test('should reject invalid pageSize type', () => {
      const result = PaginationSchema({
        pageSize: true,
        nextToken: 'token123',
      });

      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject invalid nextToken type', () => {
      const result = PaginationSchema({
        pageSize: '10',
        nextToken: 123,
      });

      expect(result).toBeInstanceOf(type.errors);
    });
  });
});
