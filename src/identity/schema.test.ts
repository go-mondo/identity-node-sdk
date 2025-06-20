import { type } from 'arktype';
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
      const result = IdentityIdentifierSchema('email');
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toBe('email');
    });

    test('should accept valid phone number identifier', () => {
      const result = IdentityIdentifierSchema('phoneNumber');
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toBe('phoneNumber');
    });

    test('should reject invalid identifiers', () => {
      expect(IdentityIdentifierSchema('username')).toBeInstanceOf(type.errors);
      expect(IdentityIdentifierSchema('invalid')).toBeInstanceOf(type.errors);
      expect(IdentityIdentifierSchema('')).toBeInstanceOf(type.errors);
    });

    test('should reject non-string values', () => {
      expect(IdentityIdentifierSchema(123)).toBeInstanceOf(type.errors);
      expect(IdentityIdentifierSchema(null)).toBeInstanceOf(type.errors);
      expect(IdentityIdentifierSchema(undefined)).toBeInstanceOf(type.errors);
    });

    test('should be case sensitive', () => {
      expect(IdentityIdentifierSchema('Email')).toBeInstanceOf(type.errors);
      expect(IdentityIdentifierSchema('PHONE_NUMBER')).toBeInstanceOf(
        type.errors
      );
      expect(IdentityIdentifierSchema('phonenumber')).toBeInstanceOf(
        type.errors
      );
    });
  });
});
