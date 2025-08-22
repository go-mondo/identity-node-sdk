import { type } from 'arktype';
import { describe, expect, test } from 'vitest';
import {
  InsertOIDCPayloadSchema,
  OIDCPayloadSchema,
  OIDCSchema,
  UpdateOIDCPayloadSchema,
} from './schema.js';

describe('App OIDC - Schema', () => {
  describe('OIDCSchema', () => {
    test('should accept complete OIDC object', () => {
      const oidc = {
        updatedAt: new Date(),
        deletedAt: new Date(),
        deactivatedAt: new Date(),
        metadata: { provider: 'auth0' },
      };

      const result = OIDCSchema(oidc);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept minimal OIDC object', () => {
      const oidc = {
        metadata: {},
      };

      const result = OIDCSchema(oidc);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept OIDC with only some optional dates', () => {
      const oidc = {
        updatedAt: new Date(),
        metadata: { configured: true },
      };

      const result = OIDCSchema(oidc);
      expect(result).not.toBeInstanceOf(type.errors);
    });
  });

  describe('OIDCPayloadSchema', () => {
    test('should accept complete payload', () => {
      const payload = {
        updatedAt: new Date().toISOString(),
        deletedAt: new Date().toISOString(),
        deactivatedAt: new Date().toISOString(),
        metadata: { issuer: 'https://auth.example.com' },
      };

      const result = OIDCPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should accept minimal payload', () => {
      const payload = {
        metadata: {},
      };

      const result = OIDCPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should accept payload with optional dates', () => {
      const payload = {
        updatedAt: new Date().toISOString(),
        metadata: { clientId: 'oidc_client_123' },
      };

      const result = OIDCPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });
  });

  describe('InsertOIDCPayloadSchema', () => {
    test('should accept metadata payload', () => {
      const payload = {
        metadata: { setup: 'initial' },
      };

      const result = InsertOIDCPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should accept undefined', () => {
      const result = InsertOIDCPayloadSchema(undefined);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toBeUndefined();
    });

    test('should accept empty metadata', () => {
      const payload = {
        metadata: {},
      };

      const result = InsertOIDCPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });
  });

  describe('UpdateOIDCPayloadSchema', () => {
    test('should accept metadata update', () => {
      const payload = {
        metadata: { version: '2.0' },
      };

      const result = UpdateOIDCPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });
  });
});
