import { describe, expect, test } from 'vitest';
import { PaginationSchema } from './pagination.js';

describe('Common Schema - Pagination', () => {
  describe('PaginationSchema', () => {
    test('should accept valid pagination with pageSize as string', () => {
      const result = PaginationSchema.safeParse({
        pageSize: '10',
        nextToken: 'token123',
      });

      // Parse succeeds for valid data
      expect(result.data).toEqual({
        pageSize: '10',
        nextToken: 'token123',
      });
    });

    test('should accept valid pagination with pageSize as number', () => {
      const result = PaginationSchema.safeParse({
        pageSize: 20,
        nextToken: 'token456',
      });

      // Parse succeeds for valid data
      expect(result.data).toEqual({
        pageSize: 20,
        nextToken: 'token456',
      });
    });

    test('should accept pagination with only pageSize', () => {
      const result = PaginationSchema.safeParse({
        pageSize: '15',
      });

      // Parse succeeds for valid data
      expect(result.data).toEqual({
        pageSize: '15',
      });
    });

    test('should accept pagination with only nextToken', () => {
      const result = PaginationSchema.safeParse({
        nextToken: 'token789',
      });

      // Parse succeeds for valid data
      expect(result.data).toEqual({
        nextToken: 'token789',
      });
    });

    test('should accept empty pagination object', () => {
      const result = PaginationSchema.safeParse({});

      // Parse succeeds for valid data
      expect(result.data).toEqual({});
    });

    test('should reject invalid pageSize type', () => {
      const result = PaginationSchema.safeParse({
        pageSize: true,
        nextToken: 'token123',
      });

      expect(result.success).toBe(false);
    });

    test('should reject invalid nextToken type', () => {
      const result = PaginationSchema.safeParse({
        pageSize: '10',
        nextToken: 123,
      });

      expect(result.success).toBe(false);
    });
  });
});
