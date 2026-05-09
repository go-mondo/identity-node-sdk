import { describe, expect, test } from 'vitest';
import {
  AppAssociationReferenceSchema,
  AppIdPropertySchema,
  AppIdSchema,
  AppPayloadSchema,
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
      const result = AppIdSchema.parse(id);
      expect(result).toBe(id);
    });

    test('should reject invalid app ID format', () => {
      expect(AppIdSchema.safeParse('invalid_id').success).toBe(false);
      expect(AppIdSchema.safeParse('wrong_prefix_123').success).toBe(false);
    });

    test('should reject non-string values', () => {
      expect(AppIdSchema.safeParse(123).success).toBe(false);
      expect(AppIdSchema.safeParse(null).success).toBe(false);
    });
  });

  describe('AppIdPropertySchema', () => {
    test('should accept valid id property', () => {
      const payload = { id: generateAppId() };
      const result = AppIdPropertySchema.parse(payload);
      expect(result).toEqual(payload);
    });

    test('should reject missing id', () => {
      const result = AppIdPropertySchema.safeParse({});
      expect(result.success).toBe(false);
    });

    test('should reject invalid id format', () => {
      const result = AppIdPropertySchema.safeParse({ id: 'invalid_id' });
      expect(result.success).toBe(false);
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

      const result = AppSchema.parse(app);
      // Parse succeeds for valid data
    });

    test('should accept minimal app object', () => {
      const app = {
        id: generateAppId(),
        status: 'enabled' as const,
        label: 'Simple App',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = AppSchema.parse(app);
      // Parse succeeds for valid data
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

      const result = AppSchema.parse(app);
      // Parse succeeds for valid data
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

      const result = AppSchema.safeParse(app);
      expect(result.success).toBe(false);
    });

    test('should reject missing required fields', () => {
      const app = {
        id: generateAppId(),
        status: 'enabled' as const,
        // missing label, createdAt, updatedAt, metadata
      };

      const result = AppSchema.safeParse(app);
      expect(result.success).toBe(false);
    });
  });

  describe('AppPayloadSchema', () => {
    test('should accept complete app payload', () => {
      const payload = {
        id: generateAppId(),
        status: 'enabled' as const,
        label: 'Payload App',
        description: 'Application payload description',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: new Date().toISOString(),
        deactivatedAt: new Date().toISOString(),
        metadata: {
          enabled: true,
          plan: 'pro',
          version: 1,
        },
      };

      const result = AppPayloadSchema.parse(payload);

      expect(result).toEqual(payload);
    });

    test('should accept minimal app payload', () => {
      const payload = {
        id: generateAppId(),
        status: 'disabled' as const,
        label: 'Minimal Payload App',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const result = AppPayloadSchema.parse(payload);

      expect(result).toEqual({
        ...payload,
        metadata: undefined,
      });
    });

    test('should convert metadata map to record', () => {
      const payload = {
        id: generateAppId(),
        status: 'enabled' as const,
        label: 'Map Metadata App',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: new Map<string, string | number | boolean>([
          ['enabled', true],
          ['plan', 'pro'],
          ['version', 2],
        ]),
      };

      const result = AppPayloadSchema.parse(payload);

      expect(result.metadata).toEqual({
        enabled: true,
        plan: 'pro',
        version: 2,
      });
    });

    test('should omit empty metadata from payload output', () => {
      const payload = {
        id: generateAppId(),
        status: 'enabled' as const,
        label: 'Empty Metadata App',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = AppPayloadSchema.parse(payload);

      expect(result.metadata).toBeUndefined();
    });

    test('should reject invalid payload metadata values', () => {
      const payload = {
        id: generateAppId(),
        status: 'enabled' as const,
        label: 'Invalid Metadata App',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          nested: { unsupported: true },
        },
      };

      const result = AppPayloadSchema.safeParse(payload);

      expect(result.success).toBe(false);
    });

    test('should reject missing required payload fields', () => {
      const payload = {
        id: generateAppId(),
        status: 'enabled' as const,
        // missing label, createdAt, updatedAt
      };

      const result = AppPayloadSchema.safeParse(payload);

      expect(result.success).toBe(false);
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

      const result = UpdateAppPayloadSchema.parse(payload);
      // Parse succeeds for valid data
      expect(result).toEqual(payload);
    });

    test('should accept empty update payload', () => {
      const result = UpdateAppPayloadSchema.parse({});
      // Parse succeeds for valid data
      expect(result).toEqual({});
    });

    test('should accept partial updates', () => {
      const payload = { label: 'New Label' };
      const result = UpdateAppPayloadSchema.parse(payload);
      // Parse succeeds for valid data
      expect(result).toEqual(payload);
    });

    test('should accept null values for nullable fields', () => {
      const payload = {
        label: null,
        description: null,
      };

      const result = UpdateAppPayloadSchema.parse(payload);
      // Parse succeeds for valid data
      expect(result).toEqual(payload);
    });

    test('should reject invalid status', () => {
      const payload = { status: 'invalid-status' };
      const result = UpdateAppPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
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

      const result = AppAssociationReferenceSchema.parse(reference);
      // Parse succeeds for valid data
      expect(result).toEqual(reference);
    });

    test('should use default status when not provided', () => {
      const reference = {
        id: generateAppId(),
        label: 'Test App',
        model: 'App' as const,
      };

      const result = AppAssociationReferenceSchema.parse(reference);
      // Parse succeeds for valid data
      expect(result.status).toBe('disabled'); // default value
    });

    test('should reject missing required fields', () => {
      const reference = { id: generateAppId() };
      const result = AppAssociationReferenceSchema.safeParse(reference);
      expect(result.success).toBe(false);
    });

    test('should reject invalid model value', () => {
      const reference = {
        id: generateAppId(),
        label: 'Test App',
        model: 'InvalidModel',
      };

      const result = AppAssociationReferenceSchema.safeParse(reference);
      expect(result.success).toBe(false);
    });
  });
});
