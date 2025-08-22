import { type } from 'arktype';
import { describe, expect, test } from 'vitest';
import {
  SettingsSchema,
  SettingsPayloadSchema,
  UpsertSettingsPayloadSchema,
} from './schema.js';

describe('Authentication Settings - Schema', () => {
  describe('SettingsSchema', () => {
    test('should accept minimal settings object', () => {
      const settings = {
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      };

      const result = SettingsSchema(settings);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should reject missing required dates', () => {
      const settings = {
        metadata: {},
        // missing createdAt, updatedAt
      };

      const result = SettingsSchema(settings);
      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('SettingsPayloadSchema', () => {
    test('should accept minimal payload', () => {
      const payload = {
        metadata: {},
      };

      const result = SettingsPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should accept payload with optional dates', () => {
      const payload = {
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = SettingsPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept empty payload', () => {
      const payload = {
        // Schema might have defaults for metadata
      };

      const result = SettingsPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });
  });

  describe('UpsertSettingsPayloadSchema', () => {
    test('should accept empty upsert payload', () => {
      const payload = {};

      const result = UpsertSettingsPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should accept upsert with only metadata', () => {
      const payload = {
        metadata: { configVersion: '2.0' },
      };

      const result = UpsertSettingsPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should reject invalid factors structure', () => {
      const payload = {
        factors: 'invalid-factors',
      };

      const result = UpsertSettingsPayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
    });
  });
});
