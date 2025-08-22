import { type } from 'arktype';
import { describe, expect, test } from 'vitest';
import { KSUIDSchema } from './id.js';

describe('Common Schema - ID', () => {
  describe('KSUIDSchema', () => {
    test('should accept valid KSUID with correct prefix', () => {
      const schema = KSUIDSchema('usr');
      const validId = 'usr_123456789012345678901234567';

      const result = schema(validId);
      expect(result).toBe(validId);
    });

    test('should accept KSUID with different prefixes', () => {
      const userSchema = KSUIDSchema('usr');
      const appSchema = KSUIDSchema('app');
      const activitySchema = KSUIDSchema('act');

      const userId = 'usr_abcdefghijklmnopqrstuvwxy12';
      const appId = 'app_1234567890ABCDEFGHIJKLMNOP1';
      const activityId = 'act_abcDEF123456789012345678901';

      expect(userSchema(userId)).toBe(userId);
      expect(appSchema(appId)).toBe(appId);
      expect(activitySchema(activityId)).toBe(activityId);
    });

    test('should accept KSUID with mixed alphanumeric characters', () => {
      const schema = KSUIDSchema('test');
      const mixedId = 'test_1a2B3c4D5e6F7g8H9i0JkLmNoPq';

      const result = schema(mixedId);
      expect(result).toBe(mixedId);
    });

    test('should reject KSUID with wrong prefix', () => {
      const schema = KSUIDSchema('usr');
      const wrongPrefixId = 'app_123456789012345678901234567';

      const result = schema(wrongPrefixId);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject KSUID with missing prefix', () => {
      const schema = KSUIDSchema('usr');
      const noPrefixId = '123456789012345678901234567';

      const result = schema(noPrefixId);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject KSUID with missing underscore', () => {
      const schema = KSUIDSchema('usr');
      const noUnderscoreId = 'usr123456789012345678901234567';

      const result = schema(noUnderscoreId);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject KSUID with incorrect suffix length (too short)', () => {
      const schema = KSUIDSchema('usr');
      const shortId = 'usr_12345678901234567890123456';

      const result = schema(shortId);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject KSUID with incorrect suffix length (too long)', () => {
      const schema = KSUIDSchema('usr');
      const longId = 'usr_1234567890123456789012345678';

      const result = schema(longId);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject KSUID with invalid characters in suffix', () => {
      const schema = KSUIDSchema('usr');
      const invalidCharsId = 'usr_123456789012345678901234_*';

      const result = schema(invalidCharsId);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject KSUID with special characters in suffix', () => {
      const schema = KSUIDSchema('usr');
      const specialCharsId = 'usr_12345678901234567890123456@';

      const result = schema(specialCharsId);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject KSUID with spaces', () => {
      const schema = KSUIDSchema('usr');
      const spaceId = 'usr_1234567890123456789012345 7';

      const result = schema(spaceId);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject empty string', () => {
      const schema = KSUIDSchema('usr');

      const result = schema('');
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject non-string values', () => {
      const schema = KSUIDSchema('usr');

      expect(schema(123)).toBeInstanceOf(type.errors);
      expect(schema(null)).toBeInstanceOf(type.errors);
      expect(schema(undefined)).toBeInstanceOf(type.errors);
      expect(schema({})).toBeInstanceOf(type.errors);
    });

    test('should work with complex prefixes', () => {
      const complexSchema = KSUIDSchema('app_config');
      const validComplexId = 'app_config_123456789012345678901234567';

      const result = complexSchema(validComplexId);
      expect(result).toBe(validComplexId);
    });

    test('should work with single character prefix', () => {
      const singleCharSchema = KSUIDSchema('a');
      const validSingleCharId = 'a_123456789012345678901234567';

      const result = singleCharSchema(validSingleCharId);
      expect(result).toBe(validSingleCharId);
    });

    test('should create different schemas for different prefixes', () => {
      const userSchema = KSUIDSchema('usr');
      const orgSchema = KSUIDSchema('org');

      const userId = 'usr_123456789012345678901234567';
      const orgId = 'org_123456789012345678901234567';

      // User schema should accept user ID but reject org ID
      expect(userSchema(userId)).toBe(userId);
      expect(userSchema(orgId)).toBeInstanceOf(type.errors);

      // Org schema should accept org ID but reject user ID
      expect(orgSchema(orgId)).toBe(orgId);
      expect(orgSchema(userId)).toBeInstanceOf(type.errors);
    });
  });
});
