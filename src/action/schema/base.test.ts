import { type } from 'arktype';
import { describe, expect, test } from 'vitest';
import {
  ActionOperation,
  ActionIdSchema,
  ActionIdPropertySchema,
  OperationSchema,
  BasePayloadSchema,
} from './base.js';
import { generateActionId } from './utils.js';

describe('Action Schema - Base', () => {
  describe('ActionOperation constants', () => {
    test('should have correct operation values', () => {
      expect(ActionOperation.SET_PASSWORD).toBe('set-password');
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
      const result = ActionIdSchema(id);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toBe(id);
    });

    test('should reject invalid action ID format', () => {
      expect(ActionIdSchema('invalid_id')).toBeInstanceOf(type.errors);
      expect(ActionIdSchema('wrong_prefix_123')).toBeInstanceOf(type.errors);
    });

    test('should reject non-string values', () => {
      expect(ActionIdSchema(123)).toBeInstanceOf(type.errors);
      expect(ActionIdSchema(null)).toBeInstanceOf(type.errors);
    });
  });

  describe('ActionIdPropertySchema', () => {
    test('should accept valid id property', () => {
      const payload = { id: generateActionId() };
      const result = ActionIdPropertySchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should reject missing id', () => {
      const result = ActionIdPropertySchema({});
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject invalid id format', () => {
      const result = ActionIdPropertySchema({ id: 'invalid_id' });
      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('OperationSchema', () => {
    test('should accept valid operations', () => {
      expect(OperationSchema('sign-up')).not.toBeInstanceOf(type.errors);
      expect(OperationSchema('sign-up-verification')).not.toBeInstanceOf(
        type.errors
      );
      expect(OperationSchema('set-password')).not.toBeInstanceOf(type.errors);
      expect(OperationSchema('user-attribute-verification')).not.toBeInstanceOf(
        type.errors
      );
    });

    test('should reject invalid operations', () => {
      expect(OperationSchema('invalid-operation')).toBeInstanceOf(type.errors);
      expect(OperationSchema('signup')).toBeInstanceOf(type.errors);
      expect(OperationSchema('')).toBeInstanceOf(type.errors);
    });

    test('should reject non-string values', () => {
      expect(OperationSchema(123)).toBeInstanceOf(type.errors);
      expect(OperationSchema(null)).toBeInstanceOf(type.errors);
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

      const result = BasePayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
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

      const result = BasePayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should reject missing required fields', () => {
      const payload = {
        id: generateActionId(),
        attempt: 1,
        // missing expiresAt, updatedAt, metadata
      };

      const result = BasePayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject invalid attempt type', () => {
      const payload = {
        id: generateActionId(),
        attempt: 'not-a-number',
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = BasePayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject invalid date formats', () => {
      const payload = {
        id: generateActionId(),
        attempt: 1,
        expiresAt: 'invalid-date',
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = BasePayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
    });
  });
});
