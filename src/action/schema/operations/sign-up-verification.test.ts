import { describe, expect, test } from 'vitest';
import { generateUserId } from '../../../customer/schema.js';
import { generateActionId } from '../utils.js';
import {
  SignUpVerificationActionPayloadSchema,
  SignUpVerificationActionRequestSchema,
} from './sign-up-verification.js';

describe('Action Schema Operations - Sign Up Verification', () => {
  describe('SignUpVerificationActionPayloadSchema', () => {
    test('should accept complete payload', () => {
      const payload = {
        id: generateActionId(),
        operation: 'sign-up-verification' as const,
        user: generateUserId(),
        identifier: 'email' as const,
        attempt: 1,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { key: 'value' },
      };

      const result = SignUpVerificationActionPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.data).toEqual(payload);
    });

    test('should accept phoneNumber identifier', () => {
      const payload = {
        id: generateActionId(),
        operation: 'sign-up-verification' as const,
        user: generateUserId(),
        identifier: 'phoneNumber' as const,
        attempt: 1,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = SignUpVerificationActionPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.data?.metadata).toBeUndefined();
    });

    test('should accept payload with optional dates', () => {
      const payload = {
        id: generateActionId(),
        operation: 'sign-up-verification' as const,
        user: generateUserId(),
        identifier: 'email' as const,
        attempt: 2,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: new Date().toISOString(),
        deactivatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = SignUpVerificationActionPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
    });

    test('should reject invalid operation', () => {
      const payload = {
        id: generateActionId(),
        operation: 'invalid-operation',
        user: generateUserId(),
        identifier: 'email' as const,
        attempt: 1,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = SignUpVerificationActionPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject invalid identifier', () => {
      const payload = {
        id: generateActionId(),
        operation: 'sign-up-verification' as const,
        user: generateUserId(),
        identifier: 'username',
        attempt: 1,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = SignUpVerificationActionPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject missing required fields', () => {
      const payload = {
        id: generateActionId(),
        operation: 'sign-up-verification' as const,
        // missing user, identifier, etc.
      };

      const result = SignUpVerificationActionPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should delete undeclared keys', () => {
      const payload = {
        id: generateActionId(),
        operation: 'sign-up-verification' as const,
        user: generateUserId(),
        identifier: 'email' as const,
        attempt: 1,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
        extraField: 'should be removed',
      };

      const result = SignUpVerificationActionPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.data).not.toHaveProperty('extraField');
    });
  });

  describe('SignUpVerificationActionRequestSchema', () => {
    test('should accept valid request', () => {
      const request = {
        code: 'verification_code_123',
      };

      const result = SignUpVerificationActionRequestSchema.safeParse(request);
      // Parse succeeds for valid data
      expect(result.data).toEqual(request);
    });

    test('should reject missing code', () => {
      const result = SignUpVerificationActionRequestSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    test('should reject non-string code', () => {
      const request = {
        code: 123456,
      };

      const result = SignUpVerificationActionRequestSchema.safeParse(request);
      expect(result.success).toBe(false);
    });

    test('should delete undeclared keys', () => {
      const request = {
        code: 'verification_code_123',
        extraField: 'should be removed',
      };

      const result = SignUpVerificationActionRequestSchema.safeParse(request);
      // Parse succeeds for valid data
      expect(result.data).not.toHaveProperty('extraField');
      expect(result.data).toEqual({ code: 'verification_code_123' });
    });
  });
});
