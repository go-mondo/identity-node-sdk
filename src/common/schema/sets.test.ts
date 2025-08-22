import { describe, expect, test } from 'vitest';
import {
  UniqueStringPayloadSchema,
  UniqueStringSetPayloadSchema,
} from './sets.js';

describe('Common Schema - Sets', () => {
  describe('UniqueStringSetPayloadSchema', () => {
    test('should accept Set of strings', () => {
      const stringSet = new Set(['a', 'b', 'c']);
      const result = UniqueStringSetPayloadSchema.safeParse(stringSet);

      // Parse succeeds for valid data
      expect(result.data).toBeInstanceOf(Set);
      expect(Array.from(result.data as Set<string>).sort()).toEqual([
        'a',
        'b',
        'c',
      ]);
    });

    test('should accept array of strings and convert to Set', () => {
      const stringArray = ['x', 'y', 'z'];
      const result = UniqueStringSetPayloadSchema.safeParse(stringArray);

      // Parse succeeds for valid data
      expect(result.data).toBeInstanceOf(Set);
      expect(Array.from(result.data as Set<string>).sort()).toEqual([
        'x',
        'y',
        'z',
      ]);
    });

    test('should handle duplicate strings in array', () => {
      const stringArray = ['a', 'b', 'a', 'c', 'b'];
      const result = UniqueStringSetPayloadSchema.safeParse(stringArray);

      // Parse succeeds for valid data
      expect(result.data).toBeInstanceOf(Set);
      expect(Array.from(result.data as Set<string>).sort()).toEqual([
        'a',
        'b',
        'c',
      ]);
    });

    test('should accept empty array', () => {
      const result = UniqueStringSetPayloadSchema.safeParse([]);

      // Parse succeeds for valid data
      expect(result.data).toBeInstanceOf(Set);
      expect((result.data as Set<string>).size).toBe(0);
    });

    test('should accept empty Set', () => {
      const emptySet = new Set<string>();
      const result = UniqueStringSetPayloadSchema.safeParse(emptySet);

      // Parse succeeds for valid data
      expect(result.data).toBeInstanceOf(Set);
      expect((result.data as Set<string>).size).toBe(0);
    });

    test('should reject non-string array elements', () => {
      const result = UniqueStringSetPayloadSchema.safeParse(['a', 123, 'b']);
      expect(result.success).toBe(false);
    });

    test('should reject non-array, non-Set values', () => {
      expect(UniqueStringSetPayloadSchema.safeParse('string').success).toBe(
        false
      );
    });
  });

  describe('UniqueStringPayloadSchema', () => {
    test('should convert Set to array', () => {
      const stringSet = new Set(['x', 'y', 'z']);
      const result = UniqueStringPayloadSchema.safeParse(stringSet);

      // Parse succeeds for valid data
      expect(Array.isArray(result.data)).toBe(true);
      expect((result.data as string[]).sort()).toEqual(['x', 'y', 'z']);
    });

    test('should convert array to unique array', () => {
      const stringArray = ['a', 'b', 'a', 'c', 'b'];
      const result = UniqueStringPayloadSchema.safeParse(stringArray);

      // Parse succeeds for valid data
      expect(Array.isArray(result.data)).toBe(true);
      expect((result.data as string[]).sort()).toEqual(['a', 'b', 'c']);
    });

    test('should handle empty inputs', () => {
      const emptySet = new Set<string>();
      const emptyArray: string[] = [];

      const setResult = UniqueStringPayloadSchema.safeParse(emptySet);
      const arrayResult = UniqueStringPayloadSchema.safeParse(emptyArray);

      // Parse succeeds for valid data
      // Parse succeeds for valid data
      expect((setResult.data as string[]).length).toBe(0);
      expect((arrayResult.data as string[]).length).toBe(0);
    });

    test('should maintain order from original Set', () => {
      const orderedSet = new Set(['first', 'second', 'third']);
      const result = UniqueStringPayloadSchema.safeParse(orderedSet);

      // Parse succeeds for valid data
      expect(result.data).toEqual(['first', 'second', 'third']);
    });
  });
});
