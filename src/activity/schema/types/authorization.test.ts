import { type } from 'arktype';
import { describe, expect, test } from 'vitest';
import { generateUserId } from '../../../customer/schema.js';
import { generateActivityId } from '../utils.js';
import {
  AuthorizationActivityPayloadSchema,
  AuthorizationActivitySchema,
  AuthorizationStatus,
  AuthorizationStatusSchema,
} from './authorization.js';

describe('Activity Schema - Authorization', () => {
  describe('AuthorizationStatus', () => {
    test('should contain expected status values', () => {
      expect(AuthorizationStatus.SUCESS).toBe('success');
      expect(AuthorizationStatus.FAIL).toBe('fail');
    });
  });

  describe('AuthorizationStatusSchema', () => {
    test('should accept success status', () => {
      const result = AuthorizationStatusSchema('success');
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toBe('success');
    });

    test('should accept fail status', () => {
      const result = AuthorizationStatusSchema('fail');
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toBe('fail');
    });

    test('should reject invalid status', () => {
      const result = AuthorizationStatusSchema('invalid_status');
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject non-string status', () => {
      const result = AuthorizationStatusSchema(123);
      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('AuthorizationActivitySchema', () => {
    test('should accept complete authorization activity with success', () => {
      const activity = {
        id: generateActivityId(),
        type: 'authorization' as const,
        status: 'success' as const,
        identity: generateUserId(),
        message: 'User authorized to access resource',
        performedBy: {
          type: 'system' as const,
          identifier: 'rbac-service',
        },
        source: 'permission-check',
        isMutateable: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: { resource: 'users', action: 'read' },
      };

      const result = AuthorizationActivitySchema(activity);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept authorization activity with fail status', () => {
      const activity = {
        id: generateActivityId(),
        type: 'authorization' as const,
        status: 'fail' as const,
        identity: generateUserId(),
        message: 'Access denied - insufficient permissions',
        performedBy: {
          type: 'system' as const,
          identifier: 'auth-guard',
        },
        source: 'api-gateway',
        isMutateable: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: { required_role: 'admin', user_role: 'user' },
      };

      const result = AuthorizationActivitySchema(activity);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept authorization activity without identity', () => {
      const activity = {
        id: generateActivityId(),
        type: 'authorization' as const,
        status: 'fail' as const,
        message: 'Anonymous access denied',
        performedBy: {
          type: 'guest' as const,
          identifier: 'anonymous-session',
        },
        source: 'public-endpoint',
        isMutateable: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: { reason: 'authentication_required' },
      };

      const result = AuthorizationActivitySchema(activity);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept authorization activity with optional fields', () => {
      const activity = {
        id: generateActivityId(),
        type: 'authorization' as const,
        status: 'success' as const,
        identity: generateUserId(),
        message: 'Service-to-service authorization successful',
        performedBy: {
          type: 'integration' as const,
          identifier: 'microservice-auth',
        },
        source: 'service-mesh',
        isMutateable: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        deactivatedAt: new Date(),
        metadata: { service: 'payment-api', scope: 'read:transactions' },
      };

      const result = AuthorizationActivitySchema(activity);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should reject authorization activity with wrong type', () => {
      const activity = {
        id: generateActivityId(),
        type: 'authentication',
        status: 'success' as const,
        identity: generateUserId(),
        message: 'Wrong type',
        performedBy: {
          type: 'system' as const,
          identifier: 'auth-service',
        },
        source: 'permission-check',
        isMutateable: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      };

      const result = AuthorizationActivitySchema(activity);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject authorization activity with invalid status', () => {
      const activity = {
        id: generateActivityId(),
        type: 'authorization' as const,
        status: 'pending',
        identity: generateUserId(),
        message: 'Test message',
        performedBy: {
          type: 'system' as const,
          identifier: 'auth-service',
        },
        source: 'permission-check',
        isMutateable: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      };

      const result = AuthorizationActivitySchema(activity);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject authorization activity missing required fields', () => {
      const activity = {
        id: generateActivityId(),
        type: 'authorization' as const,
        status: 'success' as const,
        // missing message
        performedBy: {
          type: 'system' as const,
          identifier: 'auth-service',
        },
        source: 'permission-check',
        isMutateable: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      };

      const result = AuthorizationActivitySchema(activity);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject authorization activity with invalid identity ID', () => {
      const activity = {
        id: generateActivityId(),
        type: 'authorization' as const,
        status: 'success' as const,
        identity: 'invalid_user_id',
        message: 'Test message',
        performedBy: {
          type: 'system' as const,
          identifier: 'auth-service',
        },
        source: 'permission-check',
        isMutateable: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      };

      const result = AuthorizationActivitySchema(activity);
      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('AuthorizationActivityPayloadSchema', () => {
    test('should accept complete authorization payload with success', () => {
      const payload = {
        id: generateActivityId(),
        type: 'authorization' as const,
        status: 'success' as const,
        identity: generateUserId(),
        message: 'Authorization successful',
        performedBy: {
          type: 'system' as const,
          identifier: 'policy-engine',
        },
        source: 'authorization-service',
        isMutateable: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { policy: 'admin-access', resource_id: 'res_123' },
      };

      const result = AuthorizationActivityPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should accept authorization payload with fail status', () => {
      const payload = {
        id: generateActivityId(),
        type: 'authorization' as const,
        status: 'fail' as const,
        identity: generateUserId(),
        message: 'Authorization failed - role mismatch',
        performedBy: {
          type: 'automation' as const,
          identifier: 'access-control',
        },
        source: 'middleware',
        isMutateable: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { expected_role: 'manager', actual_role: 'employee' },
      };

      const result = AuthorizationActivityPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept payload without identity', () => {
      const payload = {
        id: generateActivityId(),
        type: 'authorization' as const,
        status: 'fail' as const,
        message: 'Unauthenticated access attempt',
        performedBy: {
          type: 'guest' as const,
          identifier: 'anonymous',
        },
        source: 'public-api',
        isMutateable: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { endpoint: '/admin/users', method: 'GET' },
      };

      const result = AuthorizationActivityPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept payload with optional date fields', () => {
      const payload = {
        id: generateActivityId(),
        type: 'authorization' as const,
        status: 'success' as const,
        identity: generateUserId(),
        message: 'Scheduled authorization check',
        performedBy: {
          type: 'automation' as const,
          identifier: 'cron-permissions',
        },
        source: 'background-task',
        isMutateable: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: new Date().toISOString(),
        deactivatedAt: new Date().toISOString(),
        metadata: { scheduled: true },
      };

      const result = AuthorizationActivityPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should reject payload with invalid date format', () => {
      const payload = {
        id: generateActivityId(),
        type: 'authorization' as const,
        status: 'success' as const,
        identity: generateUserId(),
        message: 'Test authorization',
        performedBy: {
          type: 'system' as const,
          identifier: 'auth-service',
        },
        source: 'api',
        isMutateable: false,
        createdAt: 'invalid-date-format',
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = AuthorizationActivityPayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject payload with wrong type', () => {
      const payload = {
        id: generateActivityId(),
        type: 'operation',
        status: 'success' as const,
        identity: generateUserId(),
        message: 'Wrong type',
        performedBy: {
          type: 'system' as const,
          identifier: 'auth-service',
        },
        source: 'api',
        isMutateable: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = AuthorizationActivityPayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject payload with invalid status', () => {
      const payload = {
        id: generateActivityId(),
        type: 'authorization' as const,
        status: 'unknown',
        identity: generateUserId(),
        message: 'Invalid status',
        performedBy: {
          type: 'system' as const,
          identifier: 'auth-service',
        },
        source: 'api',
        isMutateable: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = AuthorizationActivityPayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
    });
  });
});
