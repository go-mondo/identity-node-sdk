import { describe, expect, test } from 'vitest';
import { z } from 'zod';
import { optionallyNullishToUndefined } from './schema.js';

describe('Common Schema', () => {
  describe('optionallyNullishToUndefined', () => {
    test('should parse null string successfully', async () => {
      const Schema = z.object({
        foo: optionallyNullishToUndefined(z.string()),
      });

      const result = Schema.parse({
        foo: null,
      });

      // Parse succeeds for valid data
      expect(result.foo).toBeUndefined();
    });

    test('should parse undefined string successfully', async () => {
      const Schema = z.object({
        foo: optionallyNullishToUndefined(z.string()),
      });

      const result = Schema.parse({
        foo: undefined,
      });

      // Parse succeeds for valid data
      expect(result.foo).toBeUndefined();
    });
  });
});
