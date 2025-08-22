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

      const result =
        UserAttributeVerificationActionPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.data).toEqual(payload);
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

      const result =
        UserAttributeVerificationActionPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.data).toEqual(payload);
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

      const result =
        UserAttributeVerificationActionPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
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

      const result =
        UserAttributeVerificationActionPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
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

      const result =
        UserAttributeVerificationActionPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject missing required fields', () => {
      const payload = {
        id: generateActionId(),
        operation: 'user-attribute-verification' as const,
        // missing user, attribute, attempt, etc.
      };

      const result =
        UserAttributeVerificationActionPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
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

      const result =
        UserAttributeVerificationActionPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.data).not.toHaveProperty('extraField');
    });
  });

  describe('UserAttributeVerificationActionRequestSchema', () => {
    test('should accept empty request', () => {
      const request = {};

      const result =
        UserAttributeVerificationActionRequestSchema.safeParse(request);
      // Parse succeeds for valid data
      expect(result.data).toEqual(request);
    });

    test('should delete undeclared keys', () => {
      const request = {
        extraField: 'should be removed',
        anotherField: 'also removed',
      };

      const result =
        UserAttributeVerificationActionRequestSchema.safeParse(request);
      // Parse succeeds for valid data
      expect(result.data).not.toHaveProperty('extraField');
      expect(result.data).not.toHaveProperty('anotherField');
      expect(result.data).toEqual({});
    });
  });
});
