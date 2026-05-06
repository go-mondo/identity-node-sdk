import { describe, expect, test } from 'vitest';
import { Algorithm, AlgorithmSchema } from './jwt.js';

describe('Common Schema - JWT', () => {
  describe('Algorithm constants', () => {
    test('should have correct algorithm values', () => {
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
    test('should accept valid RSA algorithms', () => {
      expect(AlgorithmSchema.safeParse('RS256').success).toBe(true);
      expect(AlgorithmSchema.safeParse('RS384').success).toBe(true);
      expect(AlgorithmSchema.safeParse('RS512').success).toBe(true);
    });

    test('should accept valid ECDSA algorithms', () => {
      expect(AlgorithmSchema.safeParse('ES256').success).toBe(true);
      expect(AlgorithmSchema.safeParse('ES384').success).toBe(true);
    });

    test('should accept valid PSS algorithms', () => {
      expect(AlgorithmSchema.safeParse('PS256').success).toBe(true);
      expect(AlgorithmSchema.safeParse('PS384').success).toBe(true);
      expect(AlgorithmSchema.safeParse('PS512').success).toBe(true);
    });

    test('should reject invalid algorithms', () => {
      const result1 = AlgorithmSchema.safeParse('INVALID');
      expect(result1.success).toBe(false);
      const result2 = AlgorithmSchema.safeParse('HS128');
      expect(result2.success).toBe(false);
      const result3 = AlgorithmSchema.safeParse('RS128');
      expect(result3.success).toBe(false);
      const result4 = AlgorithmSchema.safeParse('');
      expect(result4.success).toBe(false);
    });

    test('should reject non-string values', () => {
      const result1 = AlgorithmSchema.safeParse(123);
      expect(result1.success).toBe(false);
      const result2 = AlgorithmSchema.safeParse(null);
      expect(result2.success).toBe(false);
      const result3 = AlgorithmSchema.safeParse(undefined);
      expect(result3.success).toBe(false);
    });
  });
});
