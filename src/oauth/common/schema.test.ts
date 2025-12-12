import { describe, expect, test } from 'vitest';
import {
  type AnyAuthorizationDisplay,
  type AnyAuthorizationPrompt,
  type AnyCodeChallengeMethod,
  type AnyGrantType,
  type AnyOAuthScope,
  type AnyOIDCScope,
  type AnyResponseType,
  type AnyScope,
  AuthorizationDisplay,
  AuthorizationDisplaySchema,
  AuthorizationPrompt,
  AuthorizationPromptSchema,
  CodeChallengeMethod,
  CodeChallengeMethodSchema,
  GrantType,
  GrantTypeLabel,
  OAuthScope,
  OIDCScope,
  OptionalSchema,
  ResponseType,
  Scope,
  ScopeStringSchema,
} from './schema.js';

describe('OAuth Common Schema', () => {
  describe('GrantType constants', () => {
    test('should define correct grant type values', () => {
      expect(GrantType.CLIENT_CREDENTIALS).toBe('client_credentials');
      expect(GrantType.AUTHORIZATION_CODE).toBe('authorization_code');
      expect(GrantType.IMPLICIT).toBe('implicit');
      expect(GrantType.REFRESH_TOKEN).toBe('refresh_token');
    });

    test('should have corresponding labels for each grant type', () => {
      expect(GrantTypeLabel[GrantType.CLIENT_CREDENTIALS]).toBe(
        'Client Credentials'
      );
      expect(GrantTypeLabel[GrantType.AUTHORIZATION_CODE]).toBe(
        'Authorization Code'
      );
      expect(GrantTypeLabel[GrantType.IMPLICIT]).toBe('Implicit');
      expect(GrantTypeLabel[GrantType.REFRESH_TOKEN]).toBe('Refresh Token');
    });

    test('should have all grant types covered in labels', () => {
      const grantTypeKeys = Object.keys(GrantType);
      const labelKeys = Object.keys(GrantTypeLabel);

      expect(labelKeys).toHaveLength(grantTypeKeys.length);

      for (const key of grantTypeKeys) {
        const grantType = GrantType[key as keyof typeof GrantType];
        expect(GrantTypeLabel).toHaveProperty(grantType);
      }
    });

    test('AnyGrantType type should work with valid values', () => {
      const validGrantTypes: AnyGrantType[] = [
        'client_credentials',
        'authorization_code',
        'implicit',
        'refresh_token',
      ];

      for (const grantType of validGrantTypes) {
        expect(Object.values(GrantType)).toContain(grantType);
      }
    });
  });

  describe('ResponseType constants', () => {
    test('should define correct response type values', () => {
      expect(ResponseType.ID_TOKEN).toBe('id_token');
      expect(ResponseType.TOKEN).toBe('token');
      expect(ResponseType.CODE).toBe('code');
    });

    test('AnyResponseType type should work with valid values', () => {
      const validResponseTypes: AnyResponseType[] = [
        'id_token',
        'token',
        'code',
      ];

      for (const responseType of validResponseTypes) {
        expect(Object.values(ResponseType)).toContain(responseType);
      }
    });
  });

  describe('CodeChallengeMethod constants and schema', () => {
    test('should define correct code challenge method values', () => {
      expect(CodeChallengeMethod.DEFAULT).toBe('S256');
      expect(CodeChallengeMethod.S256).toBe('S256');
      expect(CodeChallengeMethod.PLAIN).toBe('plain');
    });

    test('CodeChallengeMethodSchema should validate valid methods', () => {
      const validResult1 = CodeChallengeMethodSchema.parse('S256');
      expect(validResult1).toBe('S256');

      const validResult2 = CodeChallengeMethodSchema.parse('plain');
      expect(validResult2).toBe('plain');
    });

    test('CodeChallengeMethodSchema should reject invalid methods', () => {
      const invalidResult =
        CodeChallengeMethodSchema.safeParse('invalid_method');
      expect(invalidResult.success).toBe(false);
    });

    test('AnyCodeChallengeMethod type should work with valid values', () => {
      const validMethods: AnyCodeChallengeMethod[] = ['S256', 'plain'];

      for (const method of validMethods) {
        expect(Object.values(CodeChallengeMethod)).toContain(method);
      }
    });
  });

  describe('AuthorizationDisplay constants and schema', () => {
    test('should define correct authorization display values', () => {
      expect(AuthorizationDisplay.PAGE).toBe('page');
      expect(AuthorizationDisplay.POPUP).toBe('popup');
      expect(AuthorizationDisplay.TOUCH).toBe('touch');
      expect(AuthorizationDisplay.WAP).toBe('wap');
    });

    test('AuthorizationDisplaySchema should validate valid display values', () => {
      const validDisplays = ['page', 'popup', 'touch', 'wap'];

      for (const display of validDisplays) {
        const result = AuthorizationDisplaySchema.parse(display);
        expect(result).toBe(display);
      }
    });

    test('AuthorizationDisplaySchema should reject invalid display values', () => {
      const invalidResult =
        AuthorizationDisplaySchema.safeParse('invalid_display');
      expect(invalidResult.success).toBe(false);
    });

    test('AnyAuthorizationDisplay type should work with valid values', () => {
      const validDisplays: AnyAuthorizationDisplay[] = [
        'page',
        'popup',
        'touch',
        'wap',
      ];

      for (const display of validDisplays) {
        expect(Object.values(AuthorizationDisplay)).toContain(display);
      }
    });
  });

  describe('AuthorizationPrompt constants and schema', () => {
    test('should define correct authorization prompt values', () => {
      expect(AuthorizationPrompt.NONE).toBe('none');
      expect(AuthorizationPrompt.LOGIN).toBe('login');
      expect(AuthorizationPrompt.CONSENT).toBe('consent');
      expect(AuthorizationPrompt.SELECT_ACCOUNT).toBe('select_account');
    });

    test('AuthorizationPromptSchema should validate valid prompt values', () => {
      const validPrompts = ['none', 'login', 'consent', 'select_account'];

      for (const prompt of validPrompts) {
        const result = AuthorizationPromptSchema.parse(prompt);
        expect(result).toBe(prompt);
      }
    });

    test('AuthorizationPromptSchema should reject invalid prompt values', () => {
      const invalidResult =
        AuthorizationPromptSchema.safeParse('invalid_prompt');
      expect(invalidResult.success).toBe(false);
    });

    test('AnyAuthorizationPrompt type should work with valid values', () => {
      const validPrompts: AnyAuthorizationPrompt[] = [
        'none',
        'login',
        'consent',
        'select_account',
      ];

      for (const prompt of validPrompts) {
        expect(Object.values(AuthorizationPrompt)).toContain(prompt);
      }
    });
  });

  describe('OptionalSchema', () => {
    test('should validate object with optional audience', () => {
      const validWithAudience = OptionalSchema.parse({
        audience: 'https://api.example.com',
      });
      expect(validWithAudience).toEqual({
        audience: 'https://api.example.com',
      });

      const validWithoutAudience = OptionalSchema.parse({});
      expect(validWithoutAudience).toEqual({});
    });

    test('should reject non-string audience values', () => {
      const invalidResult = OptionalSchema.safeParse({ audience: 123 });
      expect(invalidResult.success).toBe(false);
    });

    test('should allow additional properties to be filtered', () => {
      // Depending on schema configuration, extra properties might be filtered
      const input = {
        audience: 'https://api.example.com',
        extraProperty: 'should be handled based on schema config',
      };

      const result = OptionalSchema.parse(input);
      // The result depends on schema configuration (onUndeclaredKey behavior)
      expect(result).toHaveProperty('audience', 'https://api.example.com');
    });
  });

  describe('OIDC and OAuth Scopes', () => {
    test('should define correct OIDC scope values', () => {
      expect(OIDCScope.OPENID).toBe('openid');
      expect(OIDCScope.PROFILE).toBe('profile');
      expect(OIDCScope.EMAIL).toBe('email');
      expect(OIDCScope.ADDRESS).toBe('address');
      expect(OIDCScope.PHONE).toBe('phone');
    });

    test('should define correct OAuth scope values', () => {
      expect(OAuthScope.OFFLINE_ACCESS).toBe('offline_access');
    });

    test('Scope should combine OIDC and OAuth scopes', () => {
      expect(Scope.OPENID).toBe('openid');
      expect(Scope.PROFILE).toBe('profile');
      expect(Scope.EMAIL).toBe('email');
      expect(Scope.ADDRESS).toBe('address');
      expect(Scope.PHONE).toBe('phone');
      expect(Scope.OFFLINE_ACCESS).toBe('offline_access');
    });

    test('AnyOIDCScope type should work with valid OIDC values', () => {
      const validOIDCScopes: AnyOIDCScope[] = [
        'openid',
        'profile',
        'email',
        'address',
        'phone',
      ];

      for (const scope of validOIDCScopes) {
        expect(Object.values(OIDCScope)).toContain(scope);
      }
    });

    test('AnyOAuthScope type should work with valid OAuth values', () => {
      const validOAuthScopes: AnyOAuthScope[] = ['offline_access'];

      for (const scope of validOAuthScopes) {
        expect(Object.values(OAuthScope)).toContain(scope);
      }
    });

    test('AnyScope type should work with any string', () => {
      const validScopes: AnyScope[] = [
        'openid',
        'profile',
        'offline_access',
        'custom:read',
        'api:write',
        'admin:all',
      ];

      // All should be valid as AnyScope includes string
      for (const scope of validScopes) {
        expect(typeof scope).toBe('string');
      }
    });

    test('ScopeSchema should validate string values', () => {
      const validScopes = [
        'openid',
        'profile email',
        'custom:scope',
        'api:read api:write',
        'offline_access',
      ];

      for (const scope of validScopes) {
        const result = ScopeStringSchema.parse(scope);
        expect(result).toBe(scope);
      }
    });

    test('ScopeSchema should reject non-string values', () => {
      const invalidValues = [123, true, null, undefined, {}, []];

      for (const value of invalidValues) {
        const result = ScopeStringSchema.safeParse(value);
        expect(result.success).toBe(false);
      }
    });
  });

  describe('Type consistency', () => {
    test('should ensure all constants are properly typed', () => {
      // Test that constants match their type definitions
      const grantType: AnyGrantType = GrantType.AUTHORIZATION_CODE;
      expect(grantType).toBe('authorization_code');

      const responseType: AnyResponseType = ResponseType.CODE;
      expect(responseType).toBe('code');

      const challengeMethod: AnyCodeChallengeMethod = CodeChallengeMethod.S256;
      expect(challengeMethod).toBe('S256');

      const display: AnyAuthorizationDisplay = AuthorizationDisplay.PAGE;
      expect(display).toBe('page');

      const prompt: AnyAuthorizationPrompt = AuthorizationPrompt.LOGIN;
      expect(prompt).toBe('login');
    });

    test('should handle scope combinations correctly', () => {
      const oidcScope: AnyOIDCScope = 'openid';
      const oauthScope: AnyOAuthScope = 'offline_access';
      const customScope: AnyScope = 'custom:permission';

      expect(typeof oidcScope).toBe('string');
      expect(typeof oauthScope).toBe('string');
      expect(typeof customScope).toBe('string');

      // Test that combined scope includes both OIDC and OAuth
      expect(Scope).toHaveProperty('OPENID');
      expect(Scope).toHaveProperty('OFFLINE_ACCESS');
    });
  });

  describe('Schema edge cases', () => {
    test('should handle whitespace and special characters', () => {
      const spacedScope = '  openid profile  ';
      const result = ScopeStringSchema.parse(spacedScope);
      expect(result).toBe(spacedScope); // Preserves whitespace

      const specialScope = 'custom:read+write';
      const specialResult = ScopeStringSchema.parse(specialScope);
      expect(specialResult).toBe(specialScope);
    });

    test('should validate complex optional schema scenarios', () => {
      const complexValid = OptionalSchema.parse({
        audience: 'urn:example:audience',
      });
      expect(complexValid.audience).toBe('urn:example:audience');

      const emptyValid = OptionalSchema.parse({});
      expect(emptyValid).toEqual({});
    });
  });
});
