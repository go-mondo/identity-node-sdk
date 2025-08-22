import { type } from 'arktype';
import { describe, expect, test } from 'vitest';
import { CollectionSchema, PaginationCollectionSchema } from './collection.js';

describe('Common Schema - Collection', () => {
  describe('CollectionSchema', () => {
    test('should accept valid collection with string items', () => {
      const StringCollectionSchema = CollectionSchema('string');
      const result = StringCollectionSchema({
        items: ['item1', 'item2', 'item3'],
      });

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual({
        items: ['item1', 'item2', 'item3'],
      });
    });

    test('should accept valid collection with number items', () => {
      const NumberCollectionSchema = CollectionSchema('number');
      const result = NumberCollectionSchema({
        items: [1, 2, 3],
      });

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual({
        items: [1, 2, 3],
      });
    });

    test('should accept empty collection', () => {
      const StringCollectionSchema = CollectionSchema('string');
      const result = StringCollectionSchema({
        items: [],
      });

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual({
        items: [],
      });
    });

    test('should reject invalid items type', () => {
      const StringCollectionSchema = CollectionSchema('string');
      const result = StringCollectionSchema({
        items: 'not-an-array',
      });

      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('PaginationCollectionSchema', () => {
    test('should accept valid paginated collection', () => {
      const StringPaginationCollectionSchema =
        PaginationCollectionSchema('string');
      const result = StringPaginationCollectionSchema({
        items: ['item1', 'item2'],
        pagination: {
          pageSize: '10',
          nextToken: 'token123',
        },
      });

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual({
        items: ['item1', 'item2'],
        pagination: {
          pageSize: '10',
          nextToken: 'token123',
        },
      });
    });

    test('should accept collection without pagination', () => {
      const StringPaginationCollectionSchema =
        PaginationCollectionSchema('string');
      const result = StringPaginationCollectionSchema({
        items: ['item1', 'item2'],
      });

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual({
        items: ['item1', 'item2'],
      });
    });

    test('should accept collection with empty pagination', () => {
      const StringPaginationCollectionSchema =
        PaginationCollectionSchema('string');
      const result = StringPaginationCollectionSchema({
        items: ['item1'],
        pagination: {},
      });

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual({
        items: ['item1'],
        pagination: {},
      });
    });

    test('should reject invalid pagination', () => {
      const StringPaginationCollectionSchema =
        PaginationCollectionSchema('string');
      const result = StringPaginationCollectionSchema({
        items: ['item1'],
        pagination: {
          pageSize: true,
        },
      });

      expect(result).toBeInstanceOf(type.errors);
    });
  });
});
