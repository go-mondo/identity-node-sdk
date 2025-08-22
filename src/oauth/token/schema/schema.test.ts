import { describe, expect, test } from 'vitest';
import { generateAppId } from '../../../app/utils.js';
import { Schema } from './schema.js';

describe('OAuth Token - Schema', () => {
  describe('Schema union', () => {
    test('should accept authorization code grant', () => {
      const payload = {
        grant_type: 'authorization_code',
        code: 'auth_code_123',
        client_id: generateAppId(),
        redirect_uri: 'https://example.com/callback',
      };

      const result = Schema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(payload);
      }
    });

    test('should accept authorization code with PKCE', () => {
      const payload = {
        grant_type: 'authorization_code',
        code: 'auth_code_123',
        client_id: generateAppId(),
        redirect_uri: 'https://example.com/callback',
        code_verifier: 'pkce_verifier_123',
      };

      const result = Schema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(payload);
      }
    });

    test('should accept authorization code with client secret', () => {
      const payload = {
        grant_type: 'authorization_code',
        code: 'auth_code_123',
        client_id: generateAppId(),
        client_secret: 'secret_123',
        redirect_uri: 'https://example.com/callback',
      };

      const result = Schema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(payload);
      }
    });

    test('should accept client credentials grant', () => {
      const payload = {
        grant_type: 'client_credentials',
        client_id: generateAppId(),
        client_secret: 'secret_123',
        scope: 'read write',
      };

      const result = Schema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(payload);
      }
    });

    test('should accept refresh token grant', () => {
      const payload = {
        grant_type: 'refresh_token',
        refresh_token: 'refresh_token_123',
        client_id: generateAppId(),
        client_secret: 'secret_123',
        scope: 'read',
      };

      const result = Schema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(payload);
      }
    });

    test('should reject invalid grant type', () => {
      const payload = {
        grant_type: 'invalid_grant',
        code: 'auth_code_123',
        client_id: generateAppId(),
        redirect_uri: 'https://example.com/callback',
      };

      const result = Schema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject authorization code without required fields', () => {
      const payload = {
        grant_type: 'authorization_code',
        client_id: generateAppId(),
        // missing code and redirect_uri
      };

      const result = Schema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject invalid redirect URI', () => {
      const payload = {
        grant_type: 'authorization_code',
        code: 'auth_code_123',
        client_id: generateAppId(),
        redirect_uri: 'not-a-valid-url',
      };

      const result = Schema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject client credentials without required fields', () => {
      const payload = {
        grant_type: 'client_credentials',
        client_id: generateAppId(),
        // missing client_secret
      };

      const result = Schema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject refresh token without required fields', () => {
      const payload = {
        grant_type: 'refresh_token',
        client_id: 'app_123',
        // missing refresh_token and client_secret
      };

      const result = Schema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject completely invalid payload', () => {
      const payload = {
        invalid: 'data',
      };

      const result = Schema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });
});
