import { type } from 'arktype';
import { describe, expect, test } from 'vitest';
import { generateUserId } from '../../customer/schema.js';
import {
  ActivityPayloadSchema,
  ActivitySchema,
  type InsertActivityPayload,
  InsertActivityPayloadSchema,
  UpdateActivityPayloadSchema,
} from './schema.js';
import { generateActivityId } from './utils.js';

describe('Activity Schema - Main', () => {
  describe('ActivitySchema', () => {
    test('should accept note activity', () => {
      const activity = {
        id: generateActivityId(),
        type: 'note' as const,
        message: 'Test note message',
        performedBy: {
          type: 'identity' as const,
          identifier: 'user@example.com',
        },
        source: 'web-app',
        isMutateable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      };

      const result = ActivitySchema(activity);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept authentication activity', () => {
      const activity = {
        id: generateActivityId(),
        type: 'authentication' as const,
        performedBy: {
          type: 'identity' as const,
          identifier: 'user@example.com',
        },
        message: 'string',
        identity: generateUserId(),
        status: 'success',
        source: 'login-form',
        isMutateable: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: { method: 'email' },
      };

      const result = ActivitySchema(activity);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept authorization activity', () => {
      const activity = {
        id: generateActivityId(),
        type: 'authorization' as const,
        performedBy: {
          type: 'system' as const,
          identifier: 'auth-service',
        },
        message: 'string',
        status: 'success',
        source: 'rbac-check',
        isMutateable: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: { resource: 'users' },
      };

      const result = ActivitySchema(activity);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept operation activity', () => {
      const activity = {
        id: generateActivityId(),
        type: 'operation' as const,
        performedBy: {
          type: 'automation' as const,
          identifier: 'data-sync',
        },
        message: 'string',
        operation: 'delete',
        target: generateUserId(),
        source: 'cron-job',
        isMutateable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: { operation: 'sync' },
      };

      const result = ActivitySchema(activity);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept unknown activity', () => {
      const activity = {
        id: generateActivityId(),
        type: 'unknown' as const,
        performedBy: {
          type: 'guest' as const,
          identifier: 'anonymous',
        },
        message: 'string',
        source: 'external-api',
        isMutateable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      };

      const result = ActivitySchema(activity);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should reject invalid activity type', () => {
      const activity = {
        id: generateActivityId(),
        type: 'invalid_type',
        performedBy: {
          type: 'system' as const,
          identifier: 'test',
        },
        source: 'test',
        isMutateable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      };

      const result = ActivitySchema(activity);
      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('ActivityPayloadSchema', () => {
    test('should accept note activity payload', () => {
      const payload = {
        id: generateActivityId(),
        type: 'note' as const,
        message: 'Test note',
        performedBy: {
          type: 'identity' as const,
          identifier: 'user@example.com',
        },
        source: 'web-app',
        isMutateable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { urgent: true },
      };

      const result = ActivityPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should accept authentication activity payload', () => {
      const payload = {
        id: generateActivityId(),
        type: 'authentication' as const,
        performedBy: {
          type: 'identity' as const,
          identifier: 'user@example.com',
        },
        identity: generateUserId(),
        message: 'string',
        status: 'success',
        source: 'mobile-app',
        isMutateable: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { device: 'iPhone' },
      };

      const result = ActivityPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept authorization activity payload', () => {
      const payload = {
        id: generateActivityId(),
        type: 'authorization' as const,
        performedBy: {
          type: 'system' as const,
          identifier: 'permission-service',
        },
        message: 'string',
        status: 'success',
        source: 'api-gateway',
        isMutateable: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { action: 'read' },
      };

      const result = ActivityPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept operation activity payload', () => {
      const payload = {
        id: generateActivityId(),
        type: 'operation' as const,
        performedBy: {
          type: 'automation' as const,
          identifier: 'backup-service',
        },
        operation: 'create',
        target: 'target-id',
        message: 'string',
        source: 'scheduler',
        isMutateable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { backup_type: 'full' },
      };

      const result = ActivityPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept unknown activity payload', () => {
      const payload = {
        id: generateActivityId(),
        type: 'unknown' as const,
        performedBy: {
          type: 'integration' as const,
          identifier: 'webhook-handler',
        },
        message: 'string',
        source: 'external-webhook',
        isMutateable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { webhook_id: 'wh_123' },
      };

      const result = ActivityPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should reject invalid activity type in payload', () => {
      const payload = {
        id: generateActivityId(),
        type: 'invalid_type',
        performedBy: {
          type: 'system' as const,
          identifier: 'test',
        },
        source: 'test',
        isMutateable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = ActivityPayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject payload with invalid date format', () => {
      const payload = {
        id: generateActivityId(),
        type: 'note' as const,
        message: 'Test note',
        performedBy: {
          type: 'identity' as const,
          identifier: 'user@example.com',
        },
        source: 'web-app',
        isMutateable: true,
        createdAt: 'invalid-date',
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = ActivityPayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('InsertActivityPayloadSchema', () => {
    test('should accept valid insert payload', () => {
      const payload = {
        type: 'note' as const,
        message: 'New note',
        performedBy: {
          type: 'identity' as const,
          identifier: 'user@example.com',
        },
        metadata: { priority: 'high' },
      };

      const result = InsertActivityPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept minimal insert payload', () => {
      const payload = {
        type: 'note' as const,
        message: 'Simple note',
      };

      const result = InsertActivityPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      // Should generate ID automatically
      expect((result as InsertActivityPayload).id).toMatch(/^act_/);
    });

    test('should reject insert payload missing required fields', () => {
      const payload = {
        type: 'note' as const,
        // missing message
      };

      const result = InsertActivityPayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject insert payload with invalid type', () => {
      const payload = {
        type: 'invalid_type',
        message: 'Test message',
      };

      const result = InsertActivityPayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('UpdateActivityPayloadSchema', () => {
    test('should accept update payload with message', () => {
      const payload = {
        type: 'note' as const,
        message: 'Updated message',
        metadata: { updated: true },
      };

      const result = UpdateActivityPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should accept update payload without message', () => {
      const payload = {
        type: 'note' as const,
        performedBy: {
          type: 'automation' as const,
          identifier: 'update-service',
        },
        metadata: { auto_updated: true },
      };

      const result = UpdateActivityPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept minimal update payload', () => {
      const payload = {
        type: 'note' as const,
      };

      const result = UpdateActivityPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should reject update payload with invalid type', () => {
      const payload = {
        type: 'invalid_type',
        message: 'Updated message',
      };

      const result = UpdateActivityPayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should accept update with only metadata', () => {
      const payload = {
        type: 'note' as const,
        metadata: { version: '2.0' },
      };

      const result = UpdateActivityPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });
  });
});
