import { type } from 'arktype';
import { describe, expect, test } from 'vitest';
import {
  UniqueStringSetPayloadSchema,
  UniqueStringPayloadSchema,
} from './sets.js';

describe('Common Schema - Sets', () => {
  describe('UniqueStringSetPayloadSchema', () => {
    test('should accept Set of strings', () => {
      const stringSet = new Set(['a', 'b', 'c']);
      const result = UniqueStringSetPayloadSchema(stringSet);

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toBeInstanceOf(Set);
      expect(Array.from(result as Set<string>).sort()).toEqual(['a', 'b', 'c']);
    });

    test('should accept array of strings and convert to Set', () => {
      const stringArray = ['x', 'y', 'z'];
      const result = UniqueStringSetPayloadSchema(stringArray);

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toBeInstanceOf(Set);
      expect(Array.from(result as Set<string>).sort()).toEqual(['x', 'y', 'z']);
    });

    test('should handle duplicate strings in array', () => {
      const stringArray = ['a', 'b', 'a', 'c', 'b'];
      const result = UniqueStringSetPayloadSchema(stringArray);

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toBeInstanceOf(Set);
      expect(Array.from(result as Set<string>).sort()).toEqual(['a', 'b', 'c']);
    });

    test('should accept empty array', () => {
      const result = UniqueStringSetPayloadSchema([]);

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toBeInstanceOf(Set);
      expect((result as Set<string>).size).toBe(0);
    });

    test('should accept empty Set', () => {
      const emptySet = new Set<string>();
      const result = UniqueStringSetPayloadSchema(emptySet);

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toBeInstanceOf(Set);
      expect((result as Set<string>).size).toBe(0);
    });

    test('should reject non-string array elements', () => {
      const result = UniqueStringSetPayloadSchema(['a', 123, 'b']);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject non-array, non-Set values', () => {
      expect(UniqueStringSetPayloadSchema('string')).toBeInstanceOf(
        type.errors
      );
      expect(UniqueStringSetPayloadSchema(123)).toBeInstanceOf(type.errors);
      expect(UniqueStringSetPayloadSchema({})).toBeInstanceOf(type.errors);
    });
  });

  describe('UniqueStringPayloadSchema', () => {
    test('should convert Set to array', () => {
      const stringSet = new Set(['x', 'y', 'z']);
      const result = UniqueStringPayloadSchema(stringSet);

      expect(result).not.toBeInstanceOf(type.errors);
      expect(Array.isArray(result)).toBe(true);
      expect((result as string[]).sort()).toEqual(['x', 'y', 'z']);
    });

    test('should convert array to unique array', () => {
      const stringArray = ['a', 'b', 'a', 'c', 'b'];
      const result = UniqueStringPayloadSchema(stringArray);

      expect(result).not.toBeInstanceOf(type.errors);
      expect(Array.isArray(result)).toBe(true);
      expect((result as string[]).sort()).toEqual(['a', 'b', 'c']);
    });

    test('should handle empty inputs', () => {
      const emptySet = new Set<string>();
      const emptyArray: string[] = [];

      const setResult = UniqueStringPayloadSchema(emptySet);
      const arrayResult = UniqueStringPayloadSchema(emptyArray);

      expect(setResult).not.toBeInstanceOf(type.errors);
      expect(arrayResult).not.toBeInstanceOf(type.errors);
      expect((setResult as string[]).length).toBe(0);
      expect((arrayResult as string[]).length).toBe(0);
    });

    test('should maintain order from original Set', () => {
      const orderedSet = new Set(['first', 'second', 'third']);
      const result = UniqueStringPayloadSchema(orderedSet);

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(['first', 'second', 'third']);
    });
  });
});
