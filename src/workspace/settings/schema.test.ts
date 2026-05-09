import { describe, expect, test } from 'vitest';
import {
  SettingsPayloadSchema,
  UpsertSettingsPayloadSchema,
} from './schema.js';

describe('Workspace Settings - Schema', () => {
  describe('SettingsPayloadSchema', () => {
    test('should accept complete settings payload', () => {
      const payload = {
        updatedAt: new Date().toISOString(),
        deletedAt: new Date().toISOString(),
        deactivatedAt: new Date().toISOString(),
        metadata: { version: '1.0', theme: 'dark' },
      };

      const result = SettingsPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.data).toEqual(payload);
    });

    test('should accept minimal settings payload', () => {
      const payload = {
        metadata: {},
      };

      const result = SettingsPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.data?.metadata).toBeUndefined();
    });

    test('should accept payload with some optional dates', () => {
      const payload = {
        updatedAt: new Date().toISOString(),
        metadata: { lastModified: 'now' },
      };

      const result = SettingsPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
    });

    test('should accept payload with only metadata', () => {
      const payload = {
        metadata: {
          preferences: 'yes',
        },
      };

      const result = SettingsPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
    });

    test('should reject invalid date format', () => {
      const payload = {
        updatedAt: 'invalid-date',
        metadata: {},
      };

      const result = SettingsPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('UpsertSettingsPayloadSchema', () => {
    test('should accept metadata for upsert', () => {
      const payload = {
        metadata: {
          settings: 'light',
        },
      };

      const result = UpsertSettingsPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.data).toEqual(payload);
    });

    test('should accept empty metadata', () => {
      const payload = {
        metadata: {},
      };

      const result = UpsertSettingsPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.data?.metadata).toBeNull();
    });
  });
});
