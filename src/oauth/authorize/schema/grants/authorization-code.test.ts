import { describe, expect, test } from 'vitest';
import { generateAppId } from '../../../../app/utils.js';
import { CodeChallengeMethod, ResponseType } from '../../../common/schema.js';
import { AuthorizationCodeAuthorizationSchema } from './authorization-code.js';

describe('OAuth Authorization Code Schema', () => {
  describe('AuthorizationCodeSchema validation', () => {
    test('should validate minimal valid authorization code request', () => {
      const minimalPayload = {
        response_type: ResponseType.CODE,
        client_id: generateAppId(),
      };

      const result = AuthorizationCodeAuthorizationSchema.parse(minimalPayload);
      expect(result).toEqual(minimalPayload);
    });

    test('should validate complete authorization code request', () => {
      const completePayload = {
        response_type: ResponseType.CODE,
        client_id: generateAppId(),
        redirect_uri: 'https://example.com/callback',
        scope: 'openid profile email',
        state: 'random-state-value',
        code_challenge: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk',
        code_challenge_method: CodeChallengeMethod.S256,
        nonce: 'random-nonce-value',
        display: 'page',
        prompt: 'consent',
        max_age: 3600,
        audience: 'https://api.example.com',
      };

      const result =
        AuthorizationCodeAuthorizationSchema.parse(completePayload);
      expect(result).toEqual(completePayload);
    });

    test('should validate authorization code request with PKCE', () => {
      const pkcePayload = {
        response_type: ResponseType.CODE,
        client_id: generateAppId(),
        code_challenge: 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
        code_challenge_method: CodeChallengeMethod.S256,
        redirect_uri: 'https://app.example.com/auth/callback',
        scope: 'openid',
        state: 'xyz',
      };

      const result = AuthorizationCodeAuthorizationSchema.parse(pkcePayload);
      expect(result).toEqual(pkcePayload);
    });

    test('should validate authorization code request with plain PKCE', () => {
      const plainPkcePayload = {
        response_type: ResponseType.CODE,
        client_id: generateAppId(),
        code_challenge: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk',
        code_challenge_method: CodeChallengeMethod.PLAIN,
      };

      const result =
        AuthorizationCodeAuthorizationSchema.parse(plainPkcePayload);
      expect(result).toEqual(plainPkcePayload);
    });

    test('should validate request without PKCE parameters', () => {
      const noPkcePayload = {
        response_type: ResponseType.CODE,
        client_id: generateAppId(),
        redirect_uri: 'https://legacy.example.com/callback',
        scope: 'openid profile',
        state: 'legacy-state',
      };

      const result = AuthorizationCodeAuthorizationSchema.parse(noPkcePayload);
      expect(result).toEqual(noPkcePayload);
    });

    test('should validate OIDC specific parameters', () => {
      const oidcPayload = {
        response_type: ResponseType.CODE,
        client_id: generateAppId(),
        nonce: 'unique-nonce-12345',
        display: 'popup',
        prompt: 'login',
        max_age: 7200,
        scope: 'openid profile email address phone',
      };

      const result = AuthorizationCodeAuthorizationSchema.parse(oidcPayload);
      expect(result).toEqual(oidcPayload);
    });

    test('should validate with optional audience parameter', () => {
      const audiencePayload = {
        response_type: ResponseType.CODE,
        client_id: generateAppId(),
        audience: 'https://api.myservice.com',
      };

      const result =
        AuthorizationCodeAuthorizationSchema.parse(audiencePayload);
      expect(result).toEqual(audiencePayload);
    });
  });

  describe('AuthorizationCodeSchema validation errors', () => {
    test('should reject missing response_type', () => {
      const invalidPayload = {
        client_id: generateAppId(),
      };

      const result =
        AuthorizationCodeAuthorizationSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    test('should reject invalid response_type', () => {
      const invalidPayload = {
        response_type: 'invalid_type',
        client_id: generateAppId(),
      };

      const result =
        AuthorizationCodeAuthorizationSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    test('should reject missing client_id', () => {
      const invalidPayload = {
        response_type: ResponseType.CODE,
      };

      const result =
        AuthorizationCodeAuthorizationSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    test('should reject invalid client_id format', () => {
      const invalidPayload = {
        response_type: ResponseType.CODE,
        client_id: 'invalid-client-id',
      };

      const result =
        AuthorizationCodeAuthorizationSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    test('should reject invalid redirect_uri format', () => {
      const invalidPayload = {
        response_type: ResponseType.CODE,
        client_id: generateAppId(),
        redirect_uri: 'not-a-url',
      };

      const result =
        AuthorizationCodeAuthorizationSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    test('should reject invalid code_challenge_method', () => {
      const invalidPayload = {
        response_type: ResponseType.CODE,
        client_id: generateAppId(),
        code_challenge: 'valid-challenge',
        code_challenge_method: 'invalid_method',
      };

      const result =
        AuthorizationCodeAuthorizationSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    test('should reject invalid display value', () => {
      const invalidPayload = {
        response_type: ResponseType.CODE,
        client_id: generateAppId(),
        display: 'invalid_display',
      };

      const result =
        AuthorizationCodeAuthorizationSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    test('should reject invalid prompt value', () => {
      const invalidPayload = {
        response_type: ResponseType.CODE,
        client_id: generateAppId(),
        prompt: 'invalid_prompt',
      };

      const result =
        AuthorizationCodeAuthorizationSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    test('should reject non-number max_age', () => {
      const invalidPayload = {
        response_type: ResponseType.CODE,
        client_id: generateAppId(),
        max_age: 'not-a-number',
      };

      const result =
        AuthorizationCodeAuthorizationSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });

    test('should reject negative max_age', () => {
      const invalidPayload = {
        response_type: ResponseType.CODE,
        client_id: generateAppId(),
        max_age: -100,
      };

      const result =
        AuthorizationCodeAuthorizationSchema.safeParse(invalidPayload);
      expect(result.success).toBe(false);
    });
  });

  describe('PKCE validation edge cases', () => {
    test('should require both code_challenge and code_challenge_method when one is provided', () => {
      const onlyChallenge = {
        response_type: ResponseType.CODE,
        client_id: generateAppId(),
        code_challenge: 'challenge-without-method',
      };

      const result1 =
        AuthorizationCodeAuthorizationSchema.safeParse(onlyChallenge);
      expect(result1.success).toBe(false);

      const onlyMethod = {
        response_type: ResponseType.CODE,
        client_id: generateAppId(),
        code_challenge_method: CodeChallengeMethod.S256,
      };

      const result2 =
        AuthorizationCodeAuthorizationSchema.safeParse(onlyMethod);
      expect(result2.success).toBe(false);
    });

    test('should allow neither code_challenge nor code_challenge_method', () => {
      const noPkce = {
        response_type: ResponseType.CODE,
        client_id: generateAppId(),
        redirect_uri: 'https://example.com/callback',
      };

      const result = AuthorizationCodeAuthorizationSchema.parse(noPkce);
      expect(result).toEqual(noPkce);
    });

    test('should validate PKCE with S256 method', () => {
      const s256Pkce = {
        response_type: ResponseType.CODE,
        client_id: generateAppId(),
        code_challenge: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk',
        code_challenge_method: CodeChallengeMethod.S256,
      };

      const result = AuthorizationCodeAuthorizationSchema.parse(s256Pkce);
      expect(result).toEqual(s256Pkce);
    });

    test('should validate PKCE with plain method', () => {
      const plainPkce = {
        response_type: ResponseType.CODE,
        client_id: generateAppId(),
        code_challenge: 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
        code_challenge_method: CodeChallengeMethod.PLAIN,
      };

      const result = AuthorizationCodeAuthorizationSchema.parse(plainPkce);
      expect(result).toEqual(plainPkce);
    });
  });

  describe('Real-world scenarios', () => {
    test('should validate typical SPA authorization request', () => {
      const spaRequest = {
        response_type: ResponseType.CODE,
        client_id: generateAppId(),
        redirect_uri: 'https://myapp.com/auth/callback',
        scope: 'openid profile email',
        state: 'abc123def456',
        code_challenge: 'E9Melhoa2OwvFrEMTJguCHaoeK1t8URWbuGJSstw-cM',
        code_challenge_method: CodeChallengeMethod.S256,
        nonce: 'xyz789',
      };

      const result = AuthorizationCodeAuthorizationSchema.parse(spaRequest);
      expect(result).toEqual(spaRequest);
    });

    test('should validate server-side web app authorization request', () => {
      const webAppRequest = {
        response_type: ResponseType.CODE,
        client_id: generateAppId(),
        redirect_uri: 'https://webapp.example.com/oauth/callback',
        scope: 'openid profile email address phone',
        state: 'secure-random-state-12345',
      };

      const result = AuthorizationCodeAuthorizationSchema.parse(webAppRequest);
      expect(result).toEqual(webAppRequest);
    });

    test('should validate mobile app authorization request', () => {
      const mobileRequest = {
        response_type: ResponseType.CODE,
        client_id: generateAppId(),
        redirect_uri: 'com.example.myapp://oauth/callback',
        scope: 'openid profile',
        state: 'mobile-state-token',
        code_challenge: 'dBjftJeZ4CVP-mB92K27uhbUJU1p1r_wW1gFWFOEjXk',
        code_challenge_method: CodeChallengeMethod.S256,
        display: 'touch',
      };

      const result = AuthorizationCodeAuthorizationSchema.parse(mobileRequest);
      expect(result).toEqual(mobileRequest);
    });

    test('should validate enterprise SSO request', () => {
      const enterpriseRequest = {
        response_type: ResponseType.CODE,
        client_id: generateAppId(),
        redirect_uri: 'https://enterprise.example.com/sso/callback',
        scope: 'openid profile email groups',
        state: 'enterprise-session-12345',
        prompt: 'select_account',
        max_age: 28800, // 8 hours
        audience: 'https://api.enterprise.example.com',
      };

      const result =
        AuthorizationCodeAuthorizationSchema.parse(enterpriseRequest);
      expect(result).toEqual(enterpriseRequest);
    });

    test('should validate request with multiple scopes', () => {
      const multiScopeRequest = {
        response_type: ResponseType.CODE,
        client_id: generateAppId(),
        scope:
          'openid profile email address phone offline_access custom:read custom:write',
        redirect_uri: 'https://example.com/callback',
      };

      const result =
        AuthorizationCodeAuthorizationSchema.parse(multiScopeRequest);
      expect(result).toEqual(multiScopeRequest);
    });
  });

  describe('Edge cases and boundary conditions', () => {
    test('should handle empty strings for optional string fields', () => {
      const emptyStringsPayload = {
        response_type: ResponseType.CODE,
        client_id: generateAppId(),
        scope: 'test',
        state: 'test',
        nonce: 'test',
      };

      const result =
        AuthorizationCodeAuthorizationSchema.parse(emptyStringsPayload);
      expect(result).toEqual(emptyStringsPayload);
    });

    test('should handle very long valid values', () => {
      const longValuesPayload = {
        response_type: ResponseType.CODE,
        client_id: generateAppId(),
        state: 'a'.repeat(1000),
        nonce: 'b'.repeat(500),
        scope: `openid profile email ${'custom:scope'.repeat(100)}`,
      };

      const result =
        AuthorizationCodeAuthorizationSchema.parse(longValuesPayload);
      expect(result).toEqual(longValuesPayload);
    });

    test('should handle zero max_age', () => {
      const zeroMaxAge = {
        response_type: ResponseType.CODE,
        client_id: generateAppId(),
        max_age: 0,
      };

      const result = AuthorizationCodeAuthorizationSchema.parse(zeroMaxAge);
      expect(result).toEqual(zeroMaxAge);
    });

    test('should handle large max_age values', () => {
      const largeMaxAge = {
        response_type: ResponseType.CODE,
        client_id: generateAppId(),
        max_age: 31536000, // 1 year in seconds
      };

      const result = AuthorizationCodeAuthorizationSchema.parse(largeMaxAge);
      expect(result).toEqual(largeMaxAge);
    });
  });
});
