import { type } from 'arktype';
import { describe, expect, test } from 'vitest';
import { optionallyNullishToUndefined } from './schema.js';

describe('Common Schema', () => {
  describe('optionallyNullishToUndefined', () => {
    test('should parse null string successfully', async () => {
      const Schema = type({
        foo: optionallyNullishToUndefined(type('string')),
      });

      const result = Schema.assert({
        foo: null,
      });

      if (result instanceof type.errors) {
        console.log(result.summary);
      }

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result.foo).toBeUndefined();
    });

    test('should parse undefined string successfully', async () => {
      const Schema = type({
        foo: optionallyNullishToUndefined(type('string')),
      });

      const result = Schema.assert({
        foo: undefined,
      });

      if (result instanceof type.errors) {
        console.log(result.summary);
      }

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result.foo).toBeUndefined();
    });
  });
});
