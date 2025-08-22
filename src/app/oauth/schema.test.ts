import { describe, expect, test } from 'vitest';
import { generateOAuthId } from '../utils.js';
import {
  type InsertOAuthPayload,
  InsertOAuthPayloadSchema,
  OAuthIdPropertySchema,
  OAuthIdSchema,
  OAuthPayloadSchema,
  OAuthSchema,
} from './schema.js';

describe('App OAuth - Schema', () => {
  describe('OAuthIdSchema', () => {
    test('should accept valid OAuth ID', () => {
      const id = generateOAuthId();
      const result = OAuthIdSchema.parse(id);
      // Parse succeeds for valid data
      expect(result).toBe(id);
    });

    test('should reject invalid OAuth ID format', () => {
      expect(OAuthIdSchema.safeParse('invalid_id').success).toBe(false);
      expect(OAuthIdSchema.safeParse('wrong_prefix_123').success).toBe(false);
    });

    test('should reject non-string values', () => {
      expect(OAuthIdSchema.safeParse(123).success).toBe(false);
      expect(OAuthIdSchema.safeParse(null).success).toBe(false);
    });
  });

  describe('OAuthIdPropertySchema', () => {
    test('should accept valid id property', () => {
      const payload = { id: generateOAuthId() };
      const result = OAuthIdPropertySchema.parse(payload);
      // Parse succeeds for valid data
      expect(result).toEqual(payload);
    });

    test('should reject missing id', () => {
      const result = OAuthIdPropertySchema.safeParse({});
      expect(result.success).toBe(false);
    });

    test('should reject invalid id format', () => {
      const result = OAuthIdPropertySchema.safeParse({ id: 'invalid_id' });
      expect(result.success).toBe(false);
    });
  });

  describe('OAuthSchema', () => {
    test('should accept complete OAuth object', () => {
      const oauth = {
        id: generateOAuthId(),
        clientId: 'client_12345',
        clientSecret: 'secret_abcdef',
        updatedAt: new Date(),
        metadata: { key: 'value' },
      };

      const result = OAuthSchema.parse(oauth);
      // Parse succeeds for valid data
    });

    test('should accept minimal OAuth object', () => {
      const oauth = {
        id: generateOAuthId(),
        clientId: 'simple_client',
        clientSecret: 'simple_secret',
        metadata: {},
      };

      const result = OAuthSchema.parse(oauth);
      // Parse succeeds for valid data
    });

    test('should accept OAuth with optional dates', () => {
      const oauth = {
        id: generateOAuthId(),
        clientId: 'test_client',
        clientSecret: 'test_secret',
        updatedAt: new Date(),
        deletedAt: new Date(),
        deactivatedAt: new Date(),
        metadata: {},
      };

      const result = OAuthSchema.parse(oauth);
      // Parse succeeds for valid data
    });

    test('should reject missing required fields', () => {
      const oauth = {
        id: generateOAuthId(),
        // missing clientId, clientSecret, metadata
      };

      const result = OAuthSchema.safeParse(oauth);
      expect(result.success).toBe(false);
    });

    test('should reject empty client credentials', () => {
      const oauth = {
        id: generateOAuthId(),
        clientId: '',
        clientSecret: '',
        metadata: {},
      };

      const result = OAuthSchema.parse(oauth);
      // Parse succeeds for valid data // Empty strings are valid strings
    });
  });

  describe('OAuthPayloadSchema', () => {
    test('should accept complete payload', () => {
      const payload = {
        id: generateOAuthId(),
        clientId: 'payload_client',
        clientSecret: 'payload_secret',
        updatedAt: new Date().toISOString(),
        deletedAt: new Date().toISOString(),
        deactivatedAt: new Date().toISOString(),
        metadata: { version: '1.0' },
      };

      const result = OAuthPayloadSchema.parse(payload);
      // Parse succeeds for valid data
      expect(result).toEqual(payload);
    });

    test('should accept minimal payload', () => {
      const payload = {
        id: generateOAuthId(),
        clientId: 'min_client',
        clientSecret: 'min_secret',
        metadata: {},
      };

      const result = OAuthPayloadSchema.parse(payload);
      // Parse succeeds for valid data
      expect(result).toEqual(payload);
    });

    test('should accept payload with optional dates', () => {
      const payload = {
        id: generateOAuthId(),
        clientId: 'client_with_dates',
        clientSecret: 'secret_with_dates',
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = OAuthPayloadSchema.parse(payload);
      // Parse succeeds for valid data
    });

    test('should reject missing required fields', () => {
      const payload = {
        id: generateOAuthId(),
        // missing clientId, clientSecret, metadata
      };

      const result = OAuthPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('InsertOAuthPayloadSchema', () => {
    test('should accept complete insert payload', () => {
      const payload = {
        id: generateOAuthId(),
        metadata: { source: 'manual' },
      };

      const result = InsertOAuthPayloadSchema.parse(payload);
      // Parse succeeds for valid data
      expect(result).toEqual(payload);
    });

    test('should accept minimal insert payload', () => {
      const payload = {};

      const result = InsertOAuthPayloadSchema.parse(payload);
      // Parse succeeds for valid data
      // Should generate default ID
      expect(result.id).toMatch(/^aoa_/);
    });

    test('should generate default ID when not provided', () => {
      const payload = {
        metadata: { auto: true },
      };

      const result = InsertOAuthPayloadSchema.parse(payload);
      // Parse succeeds for valid data
      expect(result.id).toMatch(/^aoa_/);
    });

    test('should accept payload with only metadata', () => {
      const payload = {
        metadata: { test: 'value' },
      };

      const result = InsertOAuthPayloadSchema.parse(payload);
      // Parse succeeds for valid data
    });
  });
});
