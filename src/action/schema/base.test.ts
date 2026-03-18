import { describe, expect, test } from 'vitest';
import {
  ActionIdPropertySchema,
  ActionIdSchema,
  ActionOperation,
  BasePayloadSchema,
  OperationSchema,
} from './base.js';
import { generateActionId } from './utils.js';

describe('Action Schema - Base', () => {
  describe('ActionOperation constants', () => {
    test('should have correct operation values', () => {
      expect(ActionOperation.USER_ATTRIBUTE_VERIFICATION).toBe(
        'user-attribute-verification'
      );
      expect(ActionOperation.SIGN_UP).toBe('sign-up');
      expect(ActionOperation.SIGN_UP_VERIFICATION).toBe('sign-up-verification');
    });
  });

  describe('ActionIdSchema', () => {
    test('should accept valid action ID', () => {
      const id = generateActionId();
      const result = ActionIdSchema.safeParse(id);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(id);
      }
    });

    test('should reject invalid action ID format', () => {
      const result1 = ActionIdSchema.safeParse('invalid_id');
      expect(result1.success).toBe(false);
      const result2 = ActionIdSchema.safeParse('act_');
      expect(result2.success).toBe(false);
    });

    test('should reject non-string values', () => {
      const result1 = ActionIdSchema.safeParse(123);
      expect(result1.success).toBe(false);
      const result2 = ActionIdSchema.safeParse(null);
      expect(result2.success).toBe(false);
    });
  });

  describe('ActionIdPropertySchema', () => {
    test('should accept valid id property', () => {
      const payload = { id: generateActionId() };
      const result = ActionIdPropertySchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(payload);
      }
    });

    test('should reject missing id', () => {
      const result = ActionIdPropertySchema.safeParse({});
      expect(result.success).toBe(false);
    });

    test('should reject invalid id format', () => {
      const result = ActionIdPropertySchema.safeParse({ id: 'invalid_id' });
      expect(result.success).toBe(false);
    });
  });

  describe('OperationSchema', () => {
    test('should accept valid operations', () => {
      // Parse succeeds for valid data
      expect(OperationSchema.safeParse('sign-up-verification').success).toBe(
        true
      );
      // Parse succeeds for valid data
      expect(
        OperationSchema.safeParse('user-attribute-verification').success
      ).toBe(true);
    });

    test('should reject invalid operations', () => {
      const result1 = OperationSchema.safeParse('invalid-operation');
      expect(result1.success).toBe(false);
      const result2 = OperationSchema.safeParse('another-invalid');
      expect(result2.success).toBe(false);
      const result3 = OperationSchema.safeParse('');
      expect(result3.success).toBe(false);
    });

    test('should reject non-string values', () => {
      const result1 = OperationSchema.safeParse(123);
      expect(result1.success).toBe(false);
      const result2 = OperationSchema.safeParse(null);
      expect(result2.success).toBe(false);
    });
  });

  describe('BasePayloadSchema', () => {
    test('should accept complete base payload', () => {
      const payload = {
        id: generateActionId(),
        attempt: 1,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { key: 'value' },
      };

      const result = BasePayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
    });

    test('should accept base payload with optional dates', () => {
      const payload = {
        id: generateActionId(),
        attempt: 2,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: new Date().toISOString(),
        deactivatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = BasePayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
    });

    test('should reject missing required fields', () => {
      const payload = {
        id: generateActionId(),
        attempt: 1,
        // missing expiresAt, updatedAt, metadata
      };

      const result = BasePayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject invalid attempt type', () => {
      const payload = {
        id: generateActionId(),
        attempt: 'not-a-number',
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = BasePayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject invalid date formats', () => {
      const payload = {
        id: generateActionId(),
        attempt: 1,
        expiresAt: 'invalid-date',
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = BasePayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });
});
