import { type } from 'arktype';
import { describe, expect, test } from 'vitest';
import {
  type AppAssociationReference,
  AppAssociationReferenceSchema,
  AppIdPropertySchema,
  AppIdSchema,
  AppSchema,
  AppStatus,
  UpdateAppPayloadSchema,
} from './schema.js';
import { generateAppId } from './utils.js';

describe('App - Schema', () => {
  describe('AppStatus constants', () => {
    test('should have correct status values', () => {
      expect(AppStatus.ENABLED).toBe('enabled');
      expect(AppStatus.DISABLED).toBe('disabled');
    });
  });

  describe('AppIdSchema', () => {
    test('should accept valid app ID', () => {
      const id = generateAppId();
      const result = AppIdSchema(id);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toBe(id);
    });

    test('should reject invalid app ID format', () => {
      expect(AppIdSchema('invalid_id')).toBeInstanceOf(type.errors);
      expect(AppIdSchema('wrong_prefix_123')).toBeInstanceOf(type.errors);
    });

    test('should reject non-string values', () => {
      expect(AppIdSchema(123)).toBeInstanceOf(type.errors);
      expect(AppIdSchema(null)).toBeInstanceOf(type.errors);
    });
  });

  describe('AppIdPropertySchema', () => {
    test('should accept valid id property', () => {
      const payload = { id: generateAppId() };
      const result = AppIdPropertySchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should reject missing id', () => {
      const result = AppIdPropertySchema({});
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject invalid id format', () => {
      const result = AppIdPropertySchema({ id: 'invalid_id' });
      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('AppSchema', () => {
    test('should accept complete app object', () => {
      const app = {
        id: generateAppId(),
        status: 'enabled' as const,
        label: 'My Application',
        description: 'Application description',
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: { key: 'value' },
      };

      const result = AppSchema(app);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept minimal app object', () => {
      const app = {
        id: generateAppId(),
        status: 'enabled' as const,
        label: 'Simple App',
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      };

      const result = AppSchema(app);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept app with optional dates', () => {
      const app = {
        id: generateAppId(),
        status: 'disabled' as const,
        label: 'Disabled App',
        description: 'This app is disabled',
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        deactivatedAt: new Date(),
        metadata: {},
      };

      const result = AppSchema(app);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should reject invalid status', () => {
      const app = {
        id: generateAppId(),
        status: 'invalid-status',
        label: 'My App',
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      };

      const result = AppSchema(app);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject missing required fields', () => {
      const app = {
        id: generateAppId(),
        status: 'enabled' as const,
        // missing label, createdAt, updatedAt, metadata
      };

      const result = AppSchema(app);
      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('UpdateAppPayloadSchema', () => {
    test('should accept all optional fields', () => {
      const payload = {
        status: 'disabled' as const,
        label: 'Updated App',
        description: 'Updated description',
        metadata: { updated: true },
      };

      const result = UpdateAppPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should accept empty update payload', () => {
      const result = UpdateAppPayloadSchema({});
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual({});
    });

    test('should accept partial updates', () => {
      const payload = { label: 'New Label' };
      const result = UpdateAppPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should accept null values for nullable fields', () => {
      const payload = {
        label: null,
        description: null,
      };

      const result = UpdateAppPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should reject invalid status', () => {
      const payload = { status: 'invalid-status' };
      const result = UpdateAppPayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('AppAssociationReferenceSchema', () => {
    test('should accept complete association reference', () => {
      const reference = {
        id: generateAppId(),
        status: 'enabled' as const,
        label: 'Associated App',
        model: 'App' as const,
      };

      const result = AppAssociationReferenceSchema(reference);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(reference);
    });

    test('should use default status when not provided', () => {
      const reference = {
        id: generateAppId(),
        label: 'Test App',
        model: 'App' as const,
      };

      const result = AppAssociationReferenceSchema(reference);
      expect(result).not.toBeInstanceOf(type.errors);
      expect((result as AppAssociationReference).status).toBe('disabled'); // default value
    });

    test('should reject missing required fields', () => {
      const reference = { id: generateAppId() };
      const result = AppAssociationReferenceSchema(reference);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject invalid model value', () => {
      const reference = {
        id: generateAppId(),
        label: 'Test App',
        model: 'InvalidModel',
      };

      const result = AppAssociationReferenceSchema(reference);
      expect(result).toBeInstanceOf(type.errors);
    });
  });
});
