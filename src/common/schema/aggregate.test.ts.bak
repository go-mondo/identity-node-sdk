import { type } from 'arktype';
import { describe, expect, test } from 'vitest';
import { AggregateSchema } from './aggregate.js';

describe('Common Schema - Aggregate', () => {
  describe('AggregateSchema', () => {
    test('should accept valid aggregate with ids and count', () => {
      const result = AggregateSchema({
        ids: ['id1', 'id2', 'id3'],
        count: 25,
      });

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual({
        ids: ['id1', 'id2', 'id3'],
        count: 25,
      });
    });

    test('should accept aggregate with only ids', () => {
      const result = AggregateSchema({
        ids: ['id1', 'id2'],
      });

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual({
        ids: ['id1', 'id2'],
      });
    });

    test('should accept aggregate with only count', () => {
      const result = AggregateSchema({
        count: 42,
      });

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual({
        count: 42,
      });
    });

    test('should accept empty aggregate', () => {
      const result = AggregateSchema({});

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual({});
    });

    test('should accept aggregate with empty ids array', () => {
      const result = AggregateSchema({
        ids: [],
        count: 0,
      });

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual({
        ids: [],
        count: 0,
      });
    });

    test('should reject invalid ids type', () => {
      const result = AggregateSchema({
        ids: 'not-an-array',
        count: 10,
      });

      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject invalid count type', () => {
      const result = AggregateSchema({
        ids: ['id1'],
        count: 'not-a-number',
      });

      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject non-string items in ids array', () => {
      const result = AggregateSchema({
        ids: ['id1', 123, 'id3'],
        count: 3,
      });

      expect(result).toBeInstanceOf(type.errors);
    });
  });
});
