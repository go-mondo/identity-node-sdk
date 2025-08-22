import { type } from 'arktype';
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

      const result = SettingsPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should accept minimal settings payload', () => {
      const payload = {
        metadata: {},
      };

      const result = SettingsPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should accept payload with some optional dates', () => {
      const payload = {
        updatedAt: new Date().toISOString(),
        metadata: { lastModified: 'now' },
      };

      const result = SettingsPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept payload with only metadata', () => {
      const payload = {
        metadata: {
          preferences: 'yes',
        },
      };

      const result = SettingsPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should reject invalid date format', () => {
      const payload = {
        updatedAt: 'invalid-date',
        metadata: {},
      };

      const result = SettingsPayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('UpsertSettingsPayloadSchema', () => {
    test('should accept metadata for upsert', () => {
      const payload = {
        metadata: {
          settings: 'light',
        },
      };

      const result = UpsertSettingsPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should accept empty metadata', () => {
      const payload = {
        metadata: {},
      };

      const result = UpsertSettingsPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });
  });
});
