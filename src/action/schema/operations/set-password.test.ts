import { describe, expect, test } from 'vitest';
import { generateUserId } from '../../../customer/schema.js';
import { generateActionId } from '../utils.js';
import {
  SetPasswordActionPayloadSchema,
  SetPasswordActionRequestSchema,
} from './set-password.js';

describe('Action Schema Operations - Set Password', () => {
  describe('SetPasswordActionPayloadSchema', () => {
    test('should accept complete payload with email identifier', () => {
      const payload = {
        id: generateActionId(),
        operation: 'set-password' as const,
        user: generateUserId(),
        identifier: 'email' as const,
        policy: {},
        attempt: 1,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { key: 'value' },
      };

      const result = SetPasswordActionPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
      // Policy defaults are applied, so we don't compare exact equality
    });

    test('should accept payload with phoneNumber identifier', () => {
      const payload = {
        id: generateActionId(),
        operation: 'set-password' as const,
        user: generateUserId(),
        identifier: 'phoneNumber' as const,
        policy: {},
        attempt: 1,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = SetPasswordActionPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
      // Policy defaults are applied, so we don't compare exact equality
    });

    test('should accept payload with optional dates', () => {
      const payload = {
        id: generateActionId(),
        operation: 'set-password' as const,
        user: generateUserId(),
        identifier: 'email' as const,
        policy: {},
        attempt: 2,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: new Date().toISOString(),
        deactivatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = SetPasswordActionPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    test('should reject invalid operation', () => {
      const payload = {
        id: generateActionId(),
        operation: 'invalid-operation',
        user: generateUserId(),
        identifier: 'email' as const,
        policy: {},
        attempt: 1,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = SetPasswordActionPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject invalid identifier', () => {
      const payload = {
        id: generateActionId(),
        operation: 'set-password' as const,
        user: generateUserId(),
        identifier: 'username',
        policy: {},
        attempt: 1,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = SetPasswordActionPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject missing required fields', () => {
      const payload = {
        id: generateActionId(),
        operation: 'set-password' as const,
        // missing user, identifier, policy, etc.
      };

      const result = SetPasswordActionPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should delete undeclared keys', () => {
      const payload = {
        id: generateActionId(),
        operation: 'set-password' as const,
        user: generateUserId(),
        identifier: 'email' as const,
        policy: {},
        attempt: 1,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
        extraField: 'should be removed',
      };

      const result = SetPasswordActionPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.data).not.toHaveProperty('extraField');
    });
  });

  describe('SetPasswordActionRequestSchema', () => {
    test('should accept valid request', () => {
      const request = {
        code: 'reset_code_123',
        password: 'NewPassword123!',
      };

      const result = SetPasswordActionRequestSchema.safeParse(request);
      // Parse succeeds for valid data
      expect(result.data).toEqual(request);
    });

    test('should reject missing code', () => {
      const request = {
        password: 'NewPassword123!',
      };

      const result = SetPasswordActionRequestSchema.safeParse(request);
      expect(result.success).toBe(false);
    });

    test('should reject missing password', () => {
      const request = {
        code: 'reset_code_123',
      };

      const result = SetPasswordActionRequestSchema.safeParse(request);
      expect(result.success).toBe(false);
    });

    test('should reject non-string values', () => {
      const request1 = {
        code: 123456,
        password: 'NewPassword123!',
      };

      const request2 = {
        code: 'reset_code_123',
        password: 123456,
      };

      const result1 = SetPasswordActionRequestSchema.safeParse(request1);
      expect(result1.success).toBe(false);
      const result2 = SetPasswordActionRequestSchema.safeParse(request2);
      expect(result2.success).toBe(false);
    });

    test('should delete undeclared keys', () => {
      const request = {
        code: 'reset_code_123',
        password: 'NewPassword123!',
        extraField: 'should be removed',
      };

      const result = SetPasswordActionRequestSchema.safeParse(request);
      // Parse succeeds for valid data
      expect(result.data).not.toHaveProperty('extraField');
      expect(result.data).toEqual({
        code: 'reset_code_123',
        password: 'NewPassword123!',
      });
    });
  });
});
