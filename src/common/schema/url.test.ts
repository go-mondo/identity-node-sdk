import { describe, expect, test } from 'vitest';
import { RelativeUrlPathSchema, appendSearchParams } from './url.js';

describe('Common Schema - URL', () => {
  describe('RelativeUrlPathSchema', () => {
    test('should accept a relative path with query parameters', () => {
      const result = RelativeUrlPathSchema.safeParse(
        '/oauth/authorize?client_id=123'
      );

      expect(result.success).toBe(true);
    });

    test('should reject paths that start with a double slash', () => {
      const result = RelativeUrlPathSchema.safeParse(
        '//example.com/oauth/authorize?client_id=123'
      );

      expect(result.success).toBe(false);
    });
  });

  describe('appendSearchParams', () => {
    test('should append search params from Map to path', () => {
      const params = new Map([
        ['key1', 'value1'],
        ['key2', 'value2'],
      ]);

      const result = appendSearchParams('/api/test', params);
      expect(result).toBe('/api/test?key1=value1&key2=value2');
    });

    test('should append search params from URLSearchParams to path', () => {
      const params = new URLSearchParams();
      params.set('foo', 'bar');
      params.set('baz', 'qux');

      const result = appendSearchParams('/api/endpoint', params);
      expect(result).toBe('/api/endpoint?foo=bar&baz=qux');
    });

    test('should handle empty params', () => {
      const params = new Map();
      const result = appendSearchParams('/api/test', params);
      expect(result).toBe('/api/test');
    });

    test('should skip undefined values', () => {
      const params = new Map([
        ['key1', 'value1'],
        ['key2', undefined],
        ['key3', 'value3'],
      ]);

      const result = appendSearchParams('/api/test', params);
      expect(result).toBe('/api/test?key1=value1&key3=value3');
    });

    test('should skip null values', () => {
      const params = new Map([
        ['key1', 'value1'],
        ['key2', null],
        ['key3', 'value3'],
      ]);

      const result = appendSearchParams('/api/test', params);
      expect(result).toBe('/api/test?key1=value1&key3=value3');
    });

    test('should skip empty string values', () => {
      const params = new Map([
        ['key1', 'value1'],
        ['key2', ''],
        ['key3', 'value3'],
      ]);

      const result = appendSearchParams('/api/test', params);
      expect(result).toBe('/api/test?key1=value1&key3=value3');
    });

    test('should handle path without leading slash', () => {
      const params = new Map([['param', 'value']]);
      const result = appendSearchParams('api/test', params);
      expect(result).toBe('api/test?param=value');
    });

    test('should handle single parameter', () => {
      const params = new Map([['single', 'value']]);
      const result = appendSearchParams('/path', params);
      expect(result).toBe('/path?single=value');
    });

    test('should handle all falsy values', () => {
      const params = new Map([
        ['key1', undefined],
        ['key2', null],
        ['key3', ''],
      ]);

      const result = appendSearchParams('/api/test', params);
      expect(result).toBe('/api/test');
    });
  });
});
