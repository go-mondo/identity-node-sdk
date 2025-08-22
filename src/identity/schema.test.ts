import { describe, expect, test } from 'vitest';
import { IdentityIdentifier, IdentityIdentifierSchema } from './schema.js';

describe('Identity - Schema', () => {
  describe('IdentityIdentifier constants', () => {
    test('should have correct identifier values', () => {
      expect(IdentityIdentifier.EMAIL).toBe('email');
      expect(IdentityIdentifier.PHONE_NUMBER).toBe('phoneNumber');
    });
  });

  describe('IdentityIdentifierSchema', () => {
    test('should accept valid email identifier', () => {
      const result = IdentityIdentifierSchema.safeParse('email');
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('email');
      }
    });

    test('should accept valid phone number identifier', () => {
      const result = IdentityIdentifierSchema.safeParse('phoneNumber');
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('phoneNumber');
      }
    });

    test('should reject invalid identifiers', () => {
      expect(IdentityIdentifierSchema.safeParse('invalid').success).toBe(false);
      expect(IdentityIdentifierSchema.safeParse('username').success).toBe(
        false
      );
      expect(IdentityIdentifierSchema.safeParse('sms').success).toBe(false);
    });

    test('should reject non-string values', () => {
      expect(IdentityIdentifierSchema.safeParse(123).success).toBe(false);
      expect(IdentityIdentifierSchema.safeParse(null).success).toBe(false);
      expect(IdentityIdentifierSchema.safeParse(undefined).success).toBe(false);
    });

    test('should be case sensitive', () => {
      expect(IdentityIdentifierSchema.safeParse('EMAIL').success).toBe(false);
      expect(IdentityIdentifierSchema.safeParse('PHONE_NUMBER').success).toBe(
        false
      );
      expect(IdentityIdentifierSchema.safeParse('phonenumber').success).toBe(
        false
      );
    });
  });
});
