import { describe, expect, test } from 'vitest';
import {
  AuthorizationPayloadSchema,
  AuthorizationSchema,
  DEFAULT_ACCESS_TOKEN_DURATION,
  DEFAULT_REFRESH_TOKEN_DURATION,
  DEFAULT_SESSION_DURATION,
  UpsertAuthorizationPayloadSchema,
} from './schema.js';

describe('Workspace Authorization - Schema', () => {
  describe('AuthorizationSchema', () => {
    test('should accept complete authorization settings', () => {
      const updatedAt = new Date();
      const authorization = {
        sessionDuration: 3600,
        refreshTokenDuration: 604800,
        accessTokenDuration: 900,
        accessTokenSignatureAlgorithm: 'ES256' as const,
        updatedAt,
        deletedAt: new Date(),
        deactivatedAt: new Date(),
        metadata: {
          issuer: 'workspace',
          keyRotationEnabled: true,
        },
      };

      const result = AuthorizationSchema.safeParse(authorization);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.sessionDuration).toBe(authorization.sessionDuration);
        expect(result.data.accessTokenSignatureAlgorithm).toBe('ES256');
        expect(result.data.updatedAt).toBe(updatedAt);
        expect(result.data.metadata).toBeInstanceOf(Map);
        expect(result.data.metadata.get('issuer')).toBe('workspace');
      }
    });

    test('should apply default durations and algorithm', () => {
      const result = AuthorizationSchema.safeParse({});

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.sessionDuration).toBe(DEFAULT_SESSION_DURATION);
        expect(result.data.refreshTokenDuration).toBe(
          DEFAULT_REFRESH_TOKEN_DURATION
        );
        expect(result.data.accessTokenDuration).toBe(
          DEFAULT_ACCESS_TOKEN_DURATION
        );
        expect(result.data.accessTokenSignatureAlgorithm).toBe('RS256');
        expect(result.data.metadata).toBeInstanceOf(Map);
      }
    });

    test('should reject invalid signature algorithm', () => {
      const result = AuthorizationSchema.safeParse({
        accessTokenSignatureAlgorithm: 'HS256',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('AuthorizationPayloadSchema', () => {
    test('should serialize dates and metadata for payloads', () => {
      const updatedAt = new Date('2026-01-01T00:00:00.000Z');
      const payload = {
        sessionDuration: 7200,
        updatedAt,
        metadata: new Map<string, string | boolean>([
          ['scopeDefaults', 'workspace'],
          ['tokenRevocation', true],
        ]),
      };

      const result = AuthorizationPayloadSchema.safeParse(payload);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.updatedAt).toBe(updatedAt.toISOString());
        expect(result.data.metadata).toEqual({
          scopeDefaults: 'workspace',
          tokenRevocation: true,
        });
      }
    });
  });

  describe('UpsertAuthorizationPayloadSchema', () => {
    test('should accept partial upsert payload', () => {
      const result = UpsertAuthorizationPayloadSchema.safeParse({
        accessTokenDuration: 300,
        metadata: {
          updatedBy: 'admin',
        },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.sessionDuration).toBe(DEFAULT_SESSION_DURATION);
        expect(result.data.accessTokenDuration).toBe(300);
        expect(result.data.metadata).toEqual({ updatedBy: 'admin' });
      }
    });

    test('should normalize empty metadata to null', () => {
      const result = UpsertAuthorizationPayloadSchema.safeParse({
        metadata: {},
      });

      expect(result.success).toBe(true);
      expect(result.data?.metadata).toBeNull();
    });
  });
});
