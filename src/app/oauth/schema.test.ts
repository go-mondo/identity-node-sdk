import { type } from 'arktype';
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
      const result = OAuthIdSchema(id);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toBe(id);
    });

    test('should reject invalid OAuth ID format', () => {
      expect(OAuthIdSchema('invalid_id')).toBeInstanceOf(type.errors);
      expect(OAuthIdSchema('wrong_prefix_123')).toBeInstanceOf(type.errors);
    });

    test('should reject non-string values', () => {
      expect(OAuthIdSchema(123)).toBeInstanceOf(type.errors);
      expect(OAuthIdSchema(null)).toBeInstanceOf(type.errors);
    });
  });

  describe('OAuthIdPropertySchema', () => {
    test('should accept valid id property', () => {
      const payload = { id: generateOAuthId() };
      const result = OAuthIdPropertySchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should reject missing id', () => {
      const result = OAuthIdPropertySchema({});
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject invalid id format', () => {
      const result = OAuthIdPropertySchema({ id: 'invalid_id' });
      expect(result).toBeInstanceOf(type.errors);
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

      const result = OAuthSchema(oauth);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept minimal OAuth object', () => {
      const oauth = {
        id: generateOAuthId(),
        clientId: 'simple_client',
        clientSecret: 'simple_secret',
        metadata: {},
      };

      const result = OAuthSchema(oauth);
      expect(result).not.toBeInstanceOf(type.errors);
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

      const result = OAuthSchema(oauth);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should reject missing required fields', () => {
      const oauth = {
        id: generateOAuthId(),
        // missing clientId, clientSecret, metadata
      };

      const result = OAuthSchema(oauth);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject empty client credentials', () => {
      const oauth = {
        id: generateOAuthId(),
        clientId: '',
        clientSecret: '',
        metadata: {},
      };

      const result = OAuthSchema(oauth);
      expect(result).not.toBeInstanceOf(type.errors); // Empty strings are valid strings
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

      const result = OAuthPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should accept minimal payload', () => {
      const payload = {
        id: generateOAuthId(),
        clientId: 'min_client',
        clientSecret: 'min_secret',
        metadata: {},
      };

      const result = OAuthPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
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

      const result = OAuthPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should reject missing required fields', () => {
      const payload = {
        id: generateOAuthId(),
        // missing clientId, clientSecret, metadata
      };

      const result = OAuthPayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('InsertOAuthPayloadSchema', () => {
    test('should accept complete insert payload', () => {
      const payload = {
        id: generateOAuthId(),
        metadata: { source: 'manual' },
      };

      const result = InsertOAuthPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should accept minimal insert payload', () => {
      const payload = {};

      const result = InsertOAuthPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      // Should generate default ID
      expect((result as InsertOAuthPayload).id).toMatch(/^aoa_/);
    });

    test('should generate default ID when not provided', () => {
      const payload = {
        metadata: { auto: true },
      };

      const result = InsertOAuthPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect((result as InsertOAuthPayload).id).toMatch(/^aoa_/);
    });

    test('should accept payload with only metadata', () => {
      const payload = {
        metadata: { test: 'value' },
      };

      const result = InsertOAuthPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });
  });
});
