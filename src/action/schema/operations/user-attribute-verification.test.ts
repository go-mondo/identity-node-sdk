import { type } from 'arktype';
import { describe, expect, test } from 'vitest';
import { generateUserId } from '../../../customer/schema.js';
import { generateActionId } from '../utils.js';
import {
  UserAttributeVerificationActionPayloadSchema,
  UserAttributeVerificationActionRequestSchema,
} from './user-attribute-verification.js';

describe('Action Schema Operations - User Attribute Verification', () => {
  describe('UserAttributeVerificationActionPayloadSchema', () => {
    test('should accept complete payload with email attribute', () => {
      const payload = {
        id: generateActionId(),
        operation: 'user-attribute-verification' as const,
        user: generateUserId(),
        attribute: 'email' as const,
        attempt: 1,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { key: 'value' },
      };

      const result = UserAttributeVerificationActionPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should accept payload with phoneNumber attribute', () => {
      const payload = {
        id: generateActionId(),
        operation: 'user-attribute-verification' as const,
        user: generateUserId(),
        attribute: 'phoneNumber' as const,
        attempt: 1,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = UserAttributeVerificationActionPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should accept payload with optional dates', () => {
      const payload = {
        id: generateActionId(),
        operation: 'user-attribute-verification' as const,
        user: generateUserId(),
        attribute: 'email' as const,
        attempt: 2,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: new Date().toISOString(),
        deactivatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = UserAttributeVerificationActionPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should reject invalid operation', () => {
      const payload = {
        id: generateActionId(),
        operation: 'invalid-operation',
        user: generateUserId(),
        attribute: 'email' as const,
        attempt: 1,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = UserAttributeVerificationActionPayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject invalid attribute', () => {
      const payload = {
        id: generateActionId(),
        operation: 'user-attribute-verification' as const,
        user: generateUserId(),
        attribute: 'username',
        attempt: 1,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = UserAttributeVerificationActionPayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject missing required fields', () => {
      const payload = {
        id: generateActionId(),
        operation: 'user-attribute-verification' as const,
        // missing user, attribute, attempt, etc.
      };

      const result = UserAttributeVerificationActionPayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should delete undeclared keys', () => {
      const payload = {
        id: generateActionId(),
        operation: 'user-attribute-verification' as const,
        user: generateUserId(),
        attribute: 'email' as const,
        attempt: 1,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
        extraField: 'should be removed',
      };

      const result = UserAttributeVerificationActionPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).not.toHaveProperty('extraField');
    });
  });

  describe('UserAttributeVerificationActionRequestSchema', () => {
    test('should accept empty request', () => {
      const request = {};

      const result = UserAttributeVerificationActionRequestSchema(request);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(request);
    });

    test('should delete undeclared keys', () => {
      const request = {
        extraField: 'should be removed',
        anotherField: 'also removed',
      };

      const result = UserAttributeVerificationActionRequestSchema(request);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).not.toHaveProperty('extraField');
      expect(result).not.toHaveProperty('anotherField');
      expect(result).toEqual({});
    });
  });
});
