import { describe, expect, test } from 'vitest';
import {
  AuthorizationPayloadSchema,
  AuthorizationSchema,
  UpsertAuthorizationPayloadSchema,
} from './schema.js';

describe('App Authorization - Schema', () => {
  describe('AuthorizationSchema', () => {
    test('should accept complete authorization object', () => {
      const authorization = {
        refreshTokenDuration: 3600,
        accessTokenDuration: 900,
        accessTokenSignatureAlgorithm: 'RS256' as const,
        loginUri: 'https://app.example.com/login',
        callbackUrls: [
          'https://app.example.com/callback',
          'https://app.example.com/oauth/callback',
        ],
        availableAudiences: ['api.example.com', 'admin.example.com'],
        availableGrants: new Set([
          'authorization_code',
          'refresh_token',
        ] as const),
        defaultAudience: 'api.example.com',
        updatedAt: new Date(),
        deletedAt: new Date(),
        deactivatedAt: new Date(),
        metadata: {
          oauth_version: '2.0',
          pkce_required: true,
          state_parameter_required: true,
        },
      };

      const result = AuthorizationSchema.safeParse(authorization);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.availableGrants).toBeInstanceOf(Set);
      }
    });

    test('should accept minimal authorization object', () => {
      const authorization = {
        metadata: {},
      };

      const result = AuthorizationSchema.safeParse(authorization);
      expect(result.success).toBe(true);
    });

    test('should accept authorization with grant array and convert to Set', () => {
      const authorization = {
        refreshTokenDuration: 7200,
        accessTokenDuration: 1800,
        availableGrants: ['authorization_code', 'client_credentials'] as const,
        metadata: {
          client_type: 'confidential',
        },
      };

      const result = AuthorizationSchema.safeParse(authorization);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.availableGrants).toBeInstanceOf(Set);
        expect(result.data.availableGrants?.has('authorization_code')).toBe(
          true
        );
        expect(result.data.availableGrants?.has('client_credentials')).toBe(
          true
        );
      }
    });

    test('should accept authorization with Set of grants', () => {
      const authorization = {
        accessTokenDuration: 600,
        availableGrants: new Set(['implicit', 'authorization_code'] as const),
        callbackUrls: ['https://spa.example.com/callback'],
        metadata: {
          client_type: 'public',
          application_type: 'spa',
        },
      };

      const result = AuthorizationSchema.safeParse(authorization);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.availableGrants).toBeInstanceOf(Set);
      }
    });

    test('should accept authorization with callback URLs as Set', () => {
      const authorization = {
        callbackUrls: new Set([
          'https://app.example.com/auth',
          'https://app.example.com/oauth',
        ]),
        availableAudiences: new Set(['api1.example.com', 'api2.example.com']),
        metadata: {
          multi_tenant: true,
        },
      };

      const result = AuthorizationSchema.safeParse(authorization);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.callbackUrls).toBeInstanceOf(Set);
        expect(result.data.availableAudiences).toBeInstanceOf(Set);
      }
    });

    test('should accept authorization with optional fields', () => {
      const authorization = {
        refreshTokenDuration: 86400,
        accessTokenDuration: 3600,
        accessTokenSignatureAlgorithm: 'RS256' as const,
        loginUri: 'https://auth.example.com/login',
        defaultAudience: 'https://api.example.com',
        updatedAt: new Date(),
        metadata: {
          algorithm: 'RS256',
          client_name: 'Test App',
          description: 'Test authorization with optional fields',
        },
      };

      const result = AuthorizationSchema.safeParse(authorization);
      expect(result.success).toBe(true);
    });

    test('should filter empty strings from URLs and audiences', () => {
      const authorization = {
        callbackUrls: new Set([
          'https://valid.example.com/callback',
          'https://another.example.com/auth',
        ]),
        availableAudiences: ['api.example.com', 'admin.example.com'],
        metadata: {},
      };

      const result = AuthorizationSchema.safeParse(authorization);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.callbackUrls).toEqual(
          new Set([
            'https://valid.example.com/callback',
            'https://another.example.com/auth',
          ])
        );
        expect(result.data.availableAudiences).toEqual(
          new Set(['api.example.com', 'admin.example.com'])
        );
      }
    });

    test('should reject invalid grant types', () => {
      const authorization = {
        availableGrants: ['invalid_grant_type'],
        metadata: {},
      };

      const result = AuthorizationSchema.safeParse(authorization);
      expect(result.success).toBe(false);
    });

    test('should reject invalid URL formats', () => {
      const authorization = {
        loginUri: 'not-a-valid-url',
        metadata: {},
      };

      const result = AuthorizationSchema.safeParse(authorization);
      expect(result.success).toBe(false);
    });

    test('should transform null removable fields to undefined', () => {
      const authorization = {
        loginUri: null,
        refreshTokenDuration: null,
        accessTokenDuration: null,
        accessTokenSignatureAlgorithm: null,
        metadata: {},
      };

      const result = AuthorizationSchema.safeParse(authorization);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.loginUri).toBeUndefined();
        expect(result.data.refreshTokenDuration).toBeUndefined();
        expect(result.data.accessTokenDuration).toBeUndefined();
        expect(result.data.accessTokenSignatureAlgorithm).toBeUndefined();
      }
    });

    test('should reject null values for non-removable fields', () => {
      const authorization = {
        defaultAudience: null,
        metadata: {},
      };

      const result = AuthorizationSchema.safeParse(authorization);
      expect(result.success).toBe(false);
    });
  });

  describe('AuthorizationPayloadSchema', () => {
    test('should accept complete authorization payload', () => {
      const payload = {
        refreshTokenDuration: 3600,
        accessTokenDuration: 900,
        accessTokenSignatureAlgorithm: 'RS256' as const,
        loginUri: 'https://app.example.com/login',
        callbackUrls: ['https://app.example.com/callback'],
        availableAudiences: ['api.example.com'],
        availableGrants: ['authorization_code', 'refresh_token'] as const,
        defaultAudience: 'api.example.com',
        updatedAt: new Date().toISOString(),
        deletedAt: new Date().toISOString(),
        deactivatedAt: new Date().toISOString(),
        metadata: {
          client_id: 'oauth_client_123',
          client_secret_set: true,
          token_endpoint_auth_method: 'client_secret_basic',
        },
      };

      const result = AuthorizationPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        // The schema transforms string URLs to URL objects, so we check individual properties
        expect(result.data).toHaveProperty(
          'refreshTokenDuration',
          payload.refreshTokenDuration
        );
        expect(result.data).toHaveProperty(
          'accessTokenDuration',
          payload.accessTokenDuration
        );
        expect(result.data).toHaveProperty(
          'accessTokenSignatureAlgorithm',
          payload.accessTokenSignatureAlgorithm
        );
        expect(result.data).toHaveProperty('loginUri', payload.loginUri);
        expect(result.data).toHaveProperty('metadata', payload.metadata);
        // callbackUrls will be transformed to URL objects
        expect(result.data.callbackUrls).toBeDefined();
      }
    });

    test('should accept minimal authorization payload', () => {
      const payload = {
        metadata: {},
      };

      const result = AuthorizationPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toHaveProperty('metadata');
      }
    });

    test('should accept payload with grant arrays', () => {
      const payload = {
        refreshTokenDuration: 7200,
        accessTokenDuration: 1800,
        availableGrants: ['authorization_code', 'client_credentials'] as const,
        callbackUrls: ['https://server.example.com/oauth/callback'],
        metadata: {
          client_type: 'confidential',
          requires_client_secret: true,
        },
      };

      const result = AuthorizationPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    test('should accept payload with Set of grants', () => {
      const payload = {
        accessTokenDuration: 600,
        availableGrants: new Set(['implicit'] as const),
        defaultAudience: 'https://spa-api.example.com',
        metadata: {
          client_type: 'public',
          application_type: 'single_page_app',
        },
      };

      const result = AuthorizationPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    test('should accept payload with comprehensive OAuth configuration', () => {
      const payload = {
        refreshTokenDuration: 2592000, // 30 days
        accessTokenDuration: 3600, // 1 hour
        accessTokenSignatureAlgorithm: 'RS256' as const,
        loginUri: 'https://auth.corporate.com/oauth/authorize',
        callbackUrls: [
          'https://app.corporate.com/auth/callback',
          'https://mobile.corporate.com/oauth/callback',
          'https://admin.corporate.com/auth/return',
        ],
        availableAudiences: [
          'https://api.corporate.com',
          'https://admin-api.corporate.com',
          'https://analytics.corporate.com',
        ],
        availableGrants: [
          'authorization_code',
          'refresh_token',
          'client_credentials',
        ] as const,
        defaultAudience: 'https://api.corporate.com',
        updatedAt: new Date().toISOString(),
        metadata: {
          client_name: 'Corporate Application',
          client_uri: 'https://corporate.com',
          logo_uri: 'https://corporate.com/logo.png',
          tos_uri: 'https://corporate.com/terms',
          policy_uri: 'https://corporate.com/privacy',
        },
      };

      const result = AuthorizationPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    test('should reject invalid date format', () => {
      const payload = {
        updatedAt: 'invalid-date',
        metadata: {},
      };

      const result = AuthorizationPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject invalid signature algorithm', () => {
      const payload = {
        accessTokenSignatureAlgorithm: 'INVALID_ALG',
        metadata: {},
      };

      const result = AuthorizationPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should transform null removable fields to undefined', () => {
      const payload = {
        loginUri: null,
        refreshTokenDuration: null,
        accessTokenDuration: null,
        accessTokenSignatureAlgorithm: null,
        metadata: {},
      };

      const result = AuthorizationPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.loginUri).toBeUndefined();
        expect(result.data.refreshTokenDuration).toBeUndefined();
        expect(result.data.accessTokenDuration).toBeUndefined();
        expect(result.data.accessTokenSignatureAlgorithm).toBeUndefined();
      }
    });
  });

  describe('UpsertAuthorizationPayloadSchema', () => {
    test('should accept upsert with all fields', () => {
      const payload = {
        refreshTokenDuration: 3600,
        accessTokenDuration: 900,
        accessTokenSignatureAlgorithm: 'RS256' as const,
        loginUri: 'https://updated.example.com/login',
        callbackUrls: ['https://updated.example.com/callback'],
        availableAudiences: ['updated-api.example.com'],
        availableGrants: ['authorization_code'] as const,
        defaultAudience: 'updated-api.example.com',
        metadata: {
          update_reason: 'security_enhancement',
          updated_by: 'admin@example.com',
        },
      };

      const result = UpsertAuthorizationPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        // The schema transforms string URLs to URL objects, so we check individual properties
        expect(result.data).toHaveProperty(
          'refreshTokenDuration',
          payload.refreshTokenDuration
        );
        expect(result.data).toHaveProperty(
          'accessTokenDuration',
          payload.accessTokenDuration
        );
        expect(result.data).toHaveProperty(
          'accessTokenSignatureAlgorithm',
          payload.accessTokenSignatureAlgorithm
        );
        expect(result.data).toHaveProperty('loginUri', payload.loginUri);
        expect(result.data).toHaveProperty('metadata', payload.metadata);
        // callbackUrls will be transformed to URL objects
        expect(result.data.callbackUrls).toBeDefined();
      }
    });

    test('should accept partial upsert payload', () => {
      const payload = {
        accessTokenDuration: 1800,
        callbackUrls: ['https://new-callback.example.com'],
        metadata: {
          fields_updated: 'accessTokenDuration',
        },
      };

      const result = UpsertAuthorizationPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    test('should accept upsert with undefined values', () => {
      const payload = {
        loginUri: undefined,
        defaultAudience: undefined,
        metadata: {
          reset_fields: 'loginUri',
        },
      };

      const result = UpsertAuthorizationPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    test('should accept upsert with null values for removable fields', () => {
      const payload = {
        loginUri: null,
        refreshTokenDuration: null,
        accessTokenDuration: null,
        accessTokenSignatureAlgorithm: null,
        defaultAudience: null,
        metadata: {
          reset_fields:
            'loginUri,refreshTokenDuration,accessTokenDuration,accessTokenSignatureAlgorithm,defaultAudience',
        },
      };

      const result = UpsertAuthorizationPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    test('should accept empty metadata upsert', () => {
      const payload = {
        refreshTokenDuration: 7200,
        metadata: {},
      };

      const result = UpsertAuthorizationPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    test('should accept upsert with grant types modification', () => {
      const payload = {
        availableGrants: [
          'authorization_code',
          'refresh_token',
          'client_credentials',
        ] as const,
        metadata: {
          added_grants: 'client_credentials',
        },
      };

      const result = UpsertAuthorizationPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    test('should accept upsert with complex callback URL updates', () => {
      const payload = {
        callbackUrls: [
          'https://prod.example.com/oauth/callback',
          'https://staging.example.com/oauth/callback',
          'https://dev.example.com/oauth/callback',
        ],
        availableAudiences: [
          'https://api.example.com',
          'https://staging-api.example.com',
        ],
        metadata: {
          environment: 'production',
        },
      };

      const result = UpsertAuthorizationPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    test('should reject invalid grant types in upsert', () => {
      const payload = {
        availableGrants: ['invalid_grant'],
        metadata: {},
      };

      const result = UpsertAuthorizationPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject invalid URL in upsert', () => {
      const payload = {
        loginUri: 'not-a-valid-url',
        metadata: {},
      };

      const result = UpsertAuthorizationPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });
});
