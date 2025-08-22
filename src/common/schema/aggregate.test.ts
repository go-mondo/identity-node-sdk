import { describe, expect, test } from 'vitest';
import { AggregateSchema } from './aggregate.js';

describe('Common Schema - Aggregate', () => {
  describe('AggregateSchema', () => {
    test('should accept valid aggregate with ids and count', () => {
      const result = AggregateSchema.safeParse({
        ids: ['id1', 'id2', 'id3'],
        count: 25,
      });

      // Parse succeeds for valid data
      expect(result.data).toEqual({
        ids: ['id1', 'id2', 'id3'],
        count: 25,
      });
    });

    test('should accept aggregate with only ids', () => {
      const result = AggregateSchema.safeParse({
        ids: ['id1', 'id2'],
      });

      // Parse succeeds for valid data
      expect(result.data).toEqual({
        ids: ['id1', 'id2'],
      });
    });

    test('should accept aggregate with only count', () => {
      const result = AggregateSchema.safeParse({
        count: 42,
      });

      // Parse succeeds for valid data
      expect(result.data).toEqual({
        count: 42,
      });
    });

    test('should accept empty aggregate', () => {
      const result = AggregateSchema.safeParse({});

      // Parse succeeds for valid data
      expect(result.data).toEqual({});
    });

    test('should accept aggregate with empty ids array', () => {
      const result = AggregateSchema.safeParse({
        ids: [],
        count: 0,
      });

      // Parse succeeds for valid data
      expect(result.data).toEqual({
        ids: [],
        count: 0,
      });
    });

    test('should reject invalid ids type', () => {
      const result = AggregateSchema.safeParse({
        ids: 'not-an-array',
        count: 10,
      });

      expect(result.success).toBe(false);
    });

    test('should reject invalid count type', () => {
      const result = AggregateSchema.safeParse({
        ids: ['id1'],
        count: 'not-a-number',
      });

      expect(result.success).toBe(false);
    });

    test('should reject non-string items in ids array', () => {
      const result = AggregateSchema.safeParse({
        ids: ['id1', 123, 'id3'],
        count: 3,
      });

      expect(result.success).toBe(false);
    });
  });
});
