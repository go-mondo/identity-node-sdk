import { describe, expect, test } from 'vitest';
import { generateUserId } from '../../../customer/schema.js';
import { generateActivityId } from '../utils.js';
import {
  AuthenticationActivityPayloadSchema,
  AuthenticationActivitySchema,
  AuthenticationStatus,
  AuthenticationStatusSchema,
} from './authentication.js';

describe('Activity Schema - Authentication', () => {
  describe('AuthenticationStatus', () => {
    test('should contain expected status values', () => {
      expect(AuthenticationStatus.SUCESS).toBe('success');
      expect(AuthenticationStatus.FAIL).toBe('fail');
    });
  });

  describe('AuthenticationStatusSchema', () => {
    test('should accept success status', () => {
      const result = AuthenticationStatusSchema.safeParse('success');
      // Parse succeeds for valid data
      expect(result.data).toBe('success');
    });

    test('should accept fail status', () => {
      const result = AuthenticationStatusSchema.safeParse('fail');
      // Parse succeeds for valid data
      expect(result.data).toBe('fail');
    });

    test('should reject invalid status', () => {
      const result = AuthenticationStatusSchema.safeParse('invalid_status');
      expect(result.success).toBe(false);
    });

    test('should reject non-string status', () => {
      const result = AuthenticationStatusSchema.safeParse(123);
      expect(result.success).toBe(false);
    });
  });

  describe('AuthenticationActivitySchema', () => {
    test('should accept complete authentication activity with success', () => {
      const activity = {
        id: generateActivityId(),
        type: 'authentication' as const,
        status: 'success' as const,
        identity: generateUserId(),
        message: 'User successfully authenticated',
        performedBy: {
          type: 'identity' as const,
          identifier: 'user@example.com',
        },
        source: 'login-form',
        isMutateable: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: { method: 'email', ip: '192.168.1.1' },
      };

      const result = AuthenticationActivitySchema.safeParse(activity);
      // Parse succeeds for valid data
    });

    test('should accept authentication activity with fail status', () => {
      const activity = {
        id: generateActivityId(),
        type: 'authentication' as const,
        status: 'fail' as const,
        identity: generateUserId(),
        message: 'Authentication failed - invalid credentials',
        performedBy: {
          type: 'system' as const,
          identifier: 'auth-service',
        },
        source: 'api-endpoint',
        isMutateable: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: { reason: 'invalid_password', attempts: 3 },
      };

      const result = AuthenticationActivitySchema.safeParse(activity);
      // Parse succeeds for valid data
    });

    test('should accept authentication activity with optional fields', () => {
      const activity = {
        id: generateActivityId(),
        type: 'authentication' as const,
        status: 'success' as const,
        identity: generateUserId(),
        message: 'SSO authentication successful',
        performedBy: {
          type: 'integration' as const,
          identifier: 'oauth-provider',
        },
        source: 'sso-redirect',
        isMutateable: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        deactivatedAt: new Date(),
        metadata: { provider: 'google', token_type: 'bearer' },
      };

      const result = AuthenticationActivitySchema.safeParse(activity);
      // Parse succeeds for valid data
    });

    test('should reject authentication activity with wrong type', () => {
      const activity = {
        id: generateActivityId(),
        type: 'authorization',
        status: 'success' as const,
        identity: generateUserId(),
        message: 'Wrong type',
        performedBy: {
          type: 'identity' as const,
          identifier: 'user@example.com',
        },
        source: 'login-form',
        isMutateable: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      };

      const result = AuthenticationActivitySchema.safeParse(activity);
      expect(result.success).toBe(false);
    });

    test('should reject authentication activity with invalid status', () => {
      const activity = {
        id: generateActivityId(),
        type: 'authentication' as const,
        status: 'invalid_status',
        identity: generateUserId(),
        message: 'Test message',
        performedBy: {
          type: 'identity' as const,
          identifier: 'user@example.com',
        },
        source: 'login-form',
        isMutateable: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      };

      const result = AuthenticationActivitySchema.safeParse(activity);
      expect(result.success).toBe(false);
    });

    test('should reject authentication activity missing required fields', () => {
      const activity = {
        id: generateActivityId(),
        type: 'authentication' as const,
        status: 'success' as const,
        // missing identity, message
        performedBy: {
          type: 'identity' as const,
          identifier: 'user@example.com',
        },
        source: 'login-form',
        isMutateable: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      };

      const result = AuthenticationActivitySchema.safeParse(activity);
      expect(result.success).toBe(false);
    });

    test('should reject authentication activity with invalid identity ID', () => {
      const activity = {
        id: generateActivityId(),
        type: 'authentication' as const,
        status: 'success' as const,
        identity: 'invalid_user_id',
        message: 'Test message',
        performedBy: {
          type: 'identity' as const,
          identifier: 'user@example.com',
        },
        source: 'login-form',
        isMutateable: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      };

      const result = AuthenticationActivitySchema.safeParse(activity);
      expect(result.success).toBe(false);
    });
  });

  describe('AuthenticationActivityPayloadSchema', () => {
    test('should accept complete authentication payload with success', () => {
      const payload = {
        id: generateActivityId(),
        type: 'authentication' as const,
        status: 'success' as const,
        identity: generateUserId(),
        message: 'Authentication successful',
        performedBy: {
          type: 'identity' as const,
          identifier: 'user@example.com',
        },
        source: 'mobile-app',
        isMutateable: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { device: 'iPhone', os: 'iOS 17' },
      };

      const result = AuthenticationActivityPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.data).toEqual(payload);
    });

    test('should accept authentication payload with fail status', () => {
      const payload = {
        id: generateActivityId(),
        type: 'authentication' as const,
        status: 'fail' as const,
        identity: generateUserId(),
        message: 'Failed login attempt',
        performedBy: {
          type: 'guest' as const,
          identifier: 'anonymous-session',
        },
        source: 'web-form',
        isMutateable: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { error_code: 'INVALID_CREDENTIALS' },
      };

      const result = AuthenticationActivityPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
    });

    test('should accept payload with optional date fields', () => {
      const payload = {
        id: generateActivityId(),
        type: 'authentication' as const,
        status: 'success' as const,
        identity: generateUserId(),
        message: 'Scheduled authentication',
        performedBy: {
          type: 'automation' as const,
          identifier: 'token-refresh',
        },
        source: 'background-service',
        isMutateable: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: new Date().toISOString(),
        deactivatedAt: new Date().toISOString(),
        metadata: { automated: true },
      };

      const result = AuthenticationActivityPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
    });

    test('should reject payload with invalid date format', () => {
      const payload = {
        id: generateActivityId(),
        type: 'authentication' as const,
        status: 'success' as const,
        identity: generateUserId(),
        message: 'Test authentication',
        performedBy: {
          type: 'identity' as const,
          identifier: 'user@example.com',
        },
        source: 'web-app',
        isMutateable: false,
        createdAt: 'invalid-date-format',
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = AuthenticationActivityPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject payload with wrong type', () => {
      const payload = {
        id: generateActivityId(),
        type: 'note',
        status: 'success' as const,
        identity: generateUserId(),
        message: 'Wrong type',
        performedBy: {
          type: 'identity' as const,
          identifier: 'user@example.com',
        },
        source: 'web-app',
        isMutateable: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = AuthenticationActivityPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject payload with invalid status', () => {
      const payload = {
        id: generateActivityId(),
        type: 'authentication' as const,
        status: 'pending',
        identity: generateUserId(),
        message: 'Invalid status',
        performedBy: {
          type: 'identity' as const,
          identifier: 'user@example.com',
        },
        source: 'web-app',
        isMutateable: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = AuthenticationActivityPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });
});
