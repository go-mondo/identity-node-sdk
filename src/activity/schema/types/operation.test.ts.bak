import { type } from 'arktype';
import { describe, expect, test } from 'vitest';
import {
  OperationType,
  OperationActivitySchema,
  OperationActivityPayloadSchema,
} from './operation.js';
import { generateActivityId } from '../utils.js';

describe('Activity Schema - Operation', () => {
  describe('OperationType', () => {
    test('should contain expected operation values', () => {
      expect(OperationType.CREATE).toBe('create');
      expect(OperationType.UPDATE).toBe('update');
      expect(OperationType.DELETE).toBe('delete');
      expect(OperationType.AUTOMATION).toBe('automation');
    });
  });

  describe('OperationActivitySchema', () => {
    test('should accept complete operation activity with create', () => {
      const activity = {
        id: generateActivityId(),
        type: 'operation' as const,
        operation: 'create' as const,
        message: 'User account created successfully',
        target: 'user:123',
        performedBy: {
          type: 'identity' as const,
          identifier: 'admin@example.com',
        },
        source: 'admin-panel',
        isMutateable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: { entity: 'user', action: 'create' },
      };

      const result = OperationActivitySchema(activity);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept operation activity with update', () => {
      const activity = {
        id: generateActivityId(),
        type: 'operation' as const,
        operation: 'update' as const,
        message: 'User profile updated',
        target: 'profile:456',
        performedBy: {
          type: 'identity' as const,
          identifier: 'user@example.com',
        },
        source: 'user-dashboard',
        isMutateable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: { fields_updated: ['name', 'email'] },
      };

      const result = OperationActivitySchema(activity);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept operation activity with delete', () => {
      const activity = {
        id: generateActivityId(),
        type: 'operation' as const,
        operation: 'delete' as const,
        message: 'Resource deleted permanently',
        target: 'resource:789',
        performedBy: {
          type: 'system' as const,
          identifier: 'cleanup-service',
        },
        source: 'garbage-collector',
        isMutateable: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: { cascade: true, reason: 'retention_policy' },
      };

      const result = OperationActivitySchema(activity);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept operation activity with automation', () => {
      const activity = {
        id: generateActivityId(),
        type: 'operation' as const,
        operation: 'automation' as const,
        message: 'Automated backup completed',
        target: 'database:primary',
        performedBy: {
          type: 'automation' as const,
          identifier: 'backup-cron',
        },
        source: 'scheduler',
        isMutateable: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: { backup_size: '2.5GB', duration: '45min' },
      };

      const result = OperationActivitySchema(activity);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept operation activity with optional fields', () => {
      const activity = {
        id: generateActivityId(),
        type: 'operation' as const,
        operation: 'create' as const,
        message: 'New workspace created',
        target: 'workspace:new-team',
        performedBy: {
          type: 'integration' as const,
          identifier: 'provisioning-api',
        },
        source: 'external-system',
        isMutateable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        deactivatedAt: new Date(),
        metadata: { template: 'standard', auto_provision: true },
      };

      const result = OperationActivitySchema(activity);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should reject operation activity with wrong type', () => {
      const activity = {
        id: generateActivityId(),
        type: 'note',
        operation: 'create' as const,
        message: 'Wrong type',
        target: 'test:123',
        performedBy: {
          type: 'identity' as const,
          identifier: 'user@example.com',
        },
        source: 'api',
        isMutateable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      };

      const result = OperationActivitySchema(activity);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject operation activity with invalid operation', () => {
      const activity = {
        id: generateActivityId(),
        type: 'operation' as const,
        operation: 'invalid_operation',
        message: 'Test message',
        target: 'test:123',
        performedBy: {
          type: 'identity' as const,
          identifier: 'user@example.com',
        },
        source: 'api',
        isMutateable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      };

      const result = OperationActivitySchema(activity);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject operation activity missing required fields', () => {
      const activity = {
        id: generateActivityId(),
        type: 'operation' as const,
        operation: 'create' as const,
        // missing message, target
        performedBy: {
          type: 'identity' as const,
          identifier: 'user@example.com',
        },
        source: 'api',
        isMutateable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      };

      const result = OperationActivitySchema(activity);
      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('OperationActivityPayloadSchema', () => {
    test('should accept complete operation payload with create', () => {
      const payload = {
        id: generateActivityId(),
        type: 'operation' as const,
        operation: 'create' as const,
        message: 'New entity created',
        target: 'entity:123',
        performedBy: {
          type: 'identity' as const,
          identifier: 'creator@example.com',
        },
        source: 'web-interface',
        isMutateable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { entity_type: 'project', owner: 'team-alpha' },
      };

      const result = OperationActivityPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should accept operation payload with update', () => {
      const payload = {
        id: generateActivityId(),
        type: 'operation' as const,
        operation: 'update' as const,
        message: 'Configuration updated',
        target: 'config:app-settings',
        performedBy: {
          type: 'automation' as const,
          identifier: 'config-sync',
        },
        source: 'config-service',
        isMutateable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { version: '2.1.0', changes: 3 },
      };

      const result = OperationActivityPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept operation payload with delete', () => {
      const payload = {
        id: generateActivityId(),
        type: 'operation' as const,
        operation: 'delete' as const,
        message: 'Expired token removed',
        target: 'token:abc123',
        performedBy: {
          type: 'system' as const,
          identifier: 'token-cleanup',
        },
        source: 'maintenance-job',
        isMutateable: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { expired_at: '2024-01-01T00:00:00Z' },
      };

      const result = OperationActivityPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept operation payload with automation', () => {
      const payload = {
        id: generateActivityId(),
        type: 'operation' as const,
        operation: 'automation' as const,
        message: 'Data synchronization completed',
        target: 'sync:daily-reports',
        performedBy: {
          type: 'automation' as const,
          identifier: 'data-sync-service',
        },
        source: 'scheduled-task',
        isMutateable: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { records_synced: 1500, status: 'success' },
      };

      const result = OperationActivityPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept payload with optional date fields', () => {
      const payload = {
        id: generateActivityId(),
        type: 'operation' as const,
        operation: 'create' as const,
        message: 'Temporary resource created',
        target: 'temp:resource-456',
        performedBy: {
          type: 'guest' as const,
          identifier: 'anonymous-session',
        },
        source: 'demo-environment',
        isMutateable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: new Date().toISOString(),
        deactivatedAt: new Date().toISOString(),
        metadata: { temporary: true, ttl: 3600 },
      };

      const result = OperationActivityPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should reject payload with invalid date format', () => {
      const payload = {
        id: generateActivityId(),
        type: 'operation' as const,
        operation: 'create' as const,
        message: 'Test operation',
        target: 'test:123',
        performedBy: {
          type: 'identity' as const,
          identifier: 'user@example.com',
        },
        source: 'api',
        isMutateable: true,
        createdAt: 'invalid-date-format',
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = OperationActivityPayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject payload with wrong type', () => {
      const payload = {
        id: generateActivityId(),
        type: 'authorization',
        operation: 'create' as const,
        message: 'Wrong type',
        target: 'test:123',
        performedBy: {
          type: 'identity' as const,
          identifier: 'user@example.com',
        },
        source: 'api',
        isMutateable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = OperationActivityPayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject payload with invalid operation', () => {
      const payload = {
        id: generateActivityId(),
        type: 'operation' as const,
        operation: 'invalid_op',
        message: 'Invalid operation',
        target: 'test:123',
        performedBy: {
          type: 'identity' as const,
          identifier: 'user@example.com',
        },
        source: 'api',
        isMutateable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = OperationActivityPayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
    });
  });
});
