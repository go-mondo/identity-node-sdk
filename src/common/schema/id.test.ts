import { describe, expect, test } from 'vitest';
import { KSUIDSchema } from './id.js';

describe('Common Schema - ID', () => {
  describe('KSUIDSchema', () => {
    test('should accept valid KSUID with correct prefix', () => {
      const schema = KSUIDSchema('usr');
      const validId = 'usr_123456789012345678901234567';

      const result = schema.safeParse(validId);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(validId);
      }
    });

    test('should accept KSUID with different prefixes', () => {
      const userSchema = KSUIDSchema('usr');
      const appSchema = KSUIDSchema('app');
      const activitySchema = KSUIDSchema('act');

      const userId = 'usr_abcdefghijklmnopqrstuvwxy12';
      const appId = 'app_1234567890ABCDEFGHIJKLMNOP1';
      const activityId = 'act_abcDEF123456789012345678901';

      const userResult = userSchema.safeParse(userId);
      expect(userResult.success).toBe(true);
      if (userResult.success) expect(userResult.data).toBe(userId);

      const appResult = appSchema.safeParse(appId);
      expect(appResult.success).toBe(true);
      if (appResult.success) expect(appResult.data).toBe(appId);

      const activityResult = activitySchema.safeParse(activityId);
      expect(activityResult.success).toBe(true);
      if (activityResult.success) expect(activityResult.data).toBe(activityId);
    });

    test('should accept KSUID with mixed alphanumeric characters', () => {
      const schema = KSUIDSchema('test');
      const mixedId = 'test_1a2B3c4D5e6F7g8H9i0JkLmNoPq';

      const result = schema.safeParse(mixedId);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(mixedId);
      }
    });

    test('should reject KSUID with wrong prefix', () => {
      const schema = KSUIDSchema('usr');
      const wrongPrefixId = 'app_123456789012345678901234567';

      const result = schema.safeParse(wrongPrefixId);
      expect(result.success).toBe(false);
    });

    test('should reject KSUID with missing prefix', () => {
      const schema = KSUIDSchema('usr');
      const noPrefixId = '123456789012345678901234567';

      const result = schema.safeParse(noPrefixId);
      expect(result.success).toBe(false);
    });

    test('should reject KSUID with missing underscore', () => {
      const schema = KSUIDSchema('usr');
      const noUnderscoreId = 'usr123456789012345678901234567';

      const result = schema.safeParse(noUnderscoreId);
      expect(result.success).toBe(false);
    });

    test('should reject KSUID with incorrect suffix length (too short)', () => {
      const schema = KSUIDSchema('usr');
      const shortId = 'usr_12345678901234567890123456';

      const result = schema.safeParse(shortId);
      expect(result.success).toBe(false);
    });

    test('should reject KSUID with incorrect suffix length (too long)', () => {
      const schema = KSUIDSchema('usr');
      const longId = 'usr_1234567890123456789012345678';

      const result = schema.safeParse(longId);
      expect(result.success).toBe(false);
    });

    test('should reject KSUID with invalid characters in suffix', () => {
      const schema = KSUIDSchema('usr');
      const invalidCharsId = 'usr_123456789012345678901234_*';

      const result = schema.safeParse(invalidCharsId);
      expect(result.success).toBe(false);
    });

    test('should reject KSUID with special characters in suffix', () => {
      const schema = KSUIDSchema('usr');
      const specialCharsId = 'usr_12345678901234567890123456@';

      const result = schema.safeParse(specialCharsId);
      expect(result.success).toBe(false);
    });

    test('should reject KSUID with spaces', () => {
      const schema = KSUIDSchema('usr');
      const spaceId = 'usr_1234567890123456789012345 7';

      const result = schema.safeParse(spaceId);
      expect(result.success).toBe(false);
    });

    test('should reject empty string', () => {
      const schema = KSUIDSchema('usr');

      const result = schema.safeParse('');
      expect(result.success).toBe(false);
    });

    test('should reject non-string values', () => {
      const schema = KSUIDSchema('usr');

      const result1 = schema.safeParse(123);
      expect(result1.success).toBe(false);
      const result2 = schema.safeParse(null);
      expect(result2.success).toBe(false);
      const result3 = schema.safeParse(undefined);
      expect(result3.success).toBe(false);
      const result4 = schema.safeParse({});
      expect(result4.success).toBe(false);
    });

    test('should work with complex prefixes', () => {
      const complexSchema = KSUIDSchema('app_config');
      const validComplexId = 'app_config_123456789012345678901234567';

      const result = complexSchema.safeParse(validComplexId);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(validComplexId);
      }
    });

    test('should work with single character prefix', () => {
      const singleCharSchema = KSUIDSchema('a');
      const validSingleCharId = 'a_123456789012345678901234567';

      const result = singleCharSchema.safeParse(validSingleCharId);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(validSingleCharId);
      }
    });

    test('should create different schemas for different prefixes', () => {
      const userSchema = KSUIDSchema('usr');
      const orgSchema = KSUIDSchema('org');

      const userId = 'usr_123456789012345678901234567';
      const orgId = 'org_123456789012345678901234567';

      // User schema should accept user ID but reject org ID
      const userResult = userSchema.safeParse(userId);
      expect(userResult.success).toBe(true);
      if (userResult.success) expect(userResult.data).toBe(userId);

      const userOrgResult = userSchema.safeParse(orgId);
      expect(userOrgResult.success).toBe(false);

      // Org schema should accept org ID but reject user ID
      const orgResult = orgSchema.safeParse(orgId);
      expect(orgResult.success).toBe(true);
      if (orgResult.success) expect(orgResult.data).toBe(orgId);

      const orgUserResult = orgSchema.safeParse(userId);
      expect(orgUserResult.success).toBe(false);
    });
  });
});
