import { type } from 'arktype';
import { describe, expect, test } from 'vitest';
import { Algorithm, AlgorithmSchema } from './jwt.js';

describe('Common Schema - JWT', () => {
  describe('Algorithm constants', () => {
    test('should have correct algorithm values', () => {
      expect(Algorithm.DEFAULT).toBe('RS256');
      expect(Algorithm.HS256).toBe('HS256');
      expect(Algorithm.HS384).toBe('HS384');
      expect(Algorithm.HS512).toBe('HS512');
      expect(Algorithm.RS256).toBe('RS256');
      expect(Algorithm.RS384).toBe('RS384');
      expect(Algorithm.RS512).toBe('RS512');
      expect(Algorithm.ES256).toBe('ES256');
      expect(Algorithm.ES384).toBe('ES384');
      expect(Algorithm.ES512).toBe('ES512');
      expect(Algorithm.PS256).toBe('PS256');
      expect(Algorithm.PS384).toBe('PS384');
      expect(Algorithm.PS512).toBe('PS512');
    });
  });

  describe('AlgorithmSchema', () => {
    test('should accept valid HMAC algorithms', () => {
      expect(AlgorithmSchema('HS256')).not.toBeInstanceOf(type.errors);
      expect(AlgorithmSchema('HS384')).not.toBeInstanceOf(type.errors);
      expect(AlgorithmSchema('HS512')).not.toBeInstanceOf(type.errors);
    });

    test('should accept valid RSA algorithms', () => {
      expect(AlgorithmSchema('RS256')).not.toBeInstanceOf(type.errors);
      expect(AlgorithmSchema('RS384')).not.toBeInstanceOf(type.errors);
      expect(AlgorithmSchema('RS512')).not.toBeInstanceOf(type.errors);
    });

    test('should accept valid ECDSA algorithms', () => {
      expect(AlgorithmSchema('ES256')).not.toBeInstanceOf(type.errors);
      expect(AlgorithmSchema('ES384')).not.toBeInstanceOf(type.errors);
    });

    test('should accept valid PSS algorithms', () => {
      expect(AlgorithmSchema('PS256')).not.toBeInstanceOf(type.errors);
      expect(AlgorithmSchema('PS384')).not.toBeInstanceOf(type.errors);
      expect(AlgorithmSchema('PS512')).not.toBeInstanceOf(type.errors);
    });

    test('should reject invalid algorithms', () => {
      expect(AlgorithmSchema('INVALID')).toBeInstanceOf(type.errors);
      expect(AlgorithmSchema('HS128')).toBeInstanceOf(type.errors);
      expect(AlgorithmSchema('RS128')).toBeInstanceOf(type.errors);
      expect(AlgorithmSchema('')).toBeInstanceOf(type.errors);
    });

    test('should reject non-string values', () => {
      expect(AlgorithmSchema(123)).toBeInstanceOf(type.errors);
      expect(AlgorithmSchema(null)).toBeInstanceOf(type.errors);
      expect(AlgorithmSchema(undefined)).toBeInstanceOf(type.errors);
    });
  });
});
