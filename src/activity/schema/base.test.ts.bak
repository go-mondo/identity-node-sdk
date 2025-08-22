import { type } from 'arktype';
import { describe, expect, test } from 'vitest';
import { generateAppId } from '../../app/utils.js';
import {
  ActivityIdPropertySchema,
  ActivityIdSchema,
  ActivityType,
  BaseInsertPayloadSchema,
  BaseSchema,
  BaseUpdatePayloadSchema,
  PerformedBySchema,
  PerformerType,
  SourceSchema,
} from './base.js';
import { generateActivityId } from './utils.js';

describe('Activity Schema - Base', () => {
  describe('ActivityType constants', () => {
    test('should have correct activity type values', () => {
      expect(ActivityType.UNKNOWN).toBe('unknown');
      expect(ActivityType.NOTE).toBe('note');
      expect(ActivityType.OPERATION).toBe('operation');
      expect(ActivityType.AUTHORIZATION).toBe('authorization');
      expect(ActivityType.AUTHENTICATION).toBe('authentication');
    });
  });

  describe('PerformerType constants', () => {
    test('should have correct performer type values', () => {
      expect(PerformerType.SYSTEM).toBe('system');
      expect(PerformerType.GUEST).toBe('guest');
      expect(PerformerType.IDENTITY).toBe('identity');
      expect(PerformerType.AUTOMATION).toBe('automation');
      expect(PerformerType.INTEGRATION).toBe('integration');
    });
  });

  describe('ActivityIdSchema', () => {
    test('should accept valid activity ID', () => {
      const id = generateActivityId();
      const result = ActivityIdSchema(id);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toBe(id);
    });

    test('should reject invalid activity ID format', () => {
      expect(ActivityIdSchema('invalid_id')).toBeInstanceOf(type.errors);
      expect(ActivityIdSchema('wrong_prefix_123')).toBeInstanceOf(type.errors);
    });

    test('should reject non-string values', () => {
      expect(ActivityIdSchema(123)).toBeInstanceOf(type.errors);
      expect(ActivityIdSchema(null)).toBeInstanceOf(type.errors);
    });
  });

  describe('ActivityIdPropertySchema', () => {
    test('should accept valid id property', () => {
      const payload = { id: generateActivityId() };
      const result = ActivityIdPropertySchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should reject missing id', () => {
      const result = ActivityIdPropertySchema({});
      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('SourceSchema', () => {
    test('should accept string source', () => {
      const result = SourceSchema('api-request');
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toBe('api-request');
    });

    test('should reject non-string values', () => {
      expect(SourceSchema(123)).toBeInstanceOf(type.errors);
      expect(SourceSchema(null)).toBeInstanceOf(type.errors);
    });
  });

  describe('PerformedBySchema', () => {
    test('should accept valid performer with system type', () => {
      const performer = {
        type: 'system' as const,
        identifier: 'system-process',
      };

      const result = PerformedBySchema(performer);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(performer);
    });

    test('should accept valid performer with identity type', () => {
      const performer = {
        type: 'identity' as const,
        identifier: 'user@example.com',
      };

      const result = PerformedBySchema(performer);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(performer);
    });

    test('should accept all valid performer types', () => {
      const types = [
        'system',
        'guest',
        'identity',
        'automation',
        'integration',
      ] as const;

      for (const performerType of types) {
        const performer = {
          type: performerType,
          identifier: `test-${performerType}`,
        };
        const result = PerformedBySchema(performer);
        expect(result).not.toBeInstanceOf(type.errors);
      }
    });

    test('should reject invalid performer type', () => {
      const performer = {
        type: 'invalid',
        identifier: 'test',
      };

      const result = PerformedBySchema(performer);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject missing fields', () => {
      expect(PerformedBySchema({ type: 'system' })).toBeInstanceOf(type.errors);
      expect(PerformedBySchema({ identifier: 'test' })).toBeInstanceOf(
        type.errors
      );
    });
  });

  describe('BaseSchema', () => {
    test('should accept complete base activity', () => {
      const activity = {
        id: generateActivityId(),
        performedBy: {
          type: 'identity' as const,
          identifier: 'user@example.com',
        },
        source: 'web-app',
        app: generateAppId(),
        isMutateable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: { key: 'value' },
      };

      const result = BaseSchema(activity);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept activity without app', () => {
      const activity = {
        id: generateActivityId(),
        performedBy: {
          type: 'system' as const,
          identifier: 'background-job',
        },
        source: 'cron',
        isMutateable: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      };

      const result = BaseSchema(activity);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept activity with optional dates', () => {
      const activity = {
        id: generateActivityId(),
        performedBy: {
          type: 'guest' as const,
          identifier: 'anonymous',
        },
        source: 'public-api',
        isMutateable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        deactivatedAt: new Date(),
        metadata: {},
      };

      const result = BaseSchema(activity);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should reject missing required fields', () => {
      const activity = {
        id: generateActivityId(),
        performedBy: {
          type: 'system' as const,
          identifier: 'test',
        },
        // missing source, isMutateable, dates, metadata
      };

      const result = BaseSchema(activity);
      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('BaseInsertPayloadSchema', () => {
    test('should accept complete insert payload', () => {
      const payload = {
        id: generateActivityId(),
        performedBy: {
          type: 'identity' as const,
          identifier: 'user123',
        },
        metadata: { source: 'api' },
      };

      const result = BaseInsertPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept minimal insert payload', () => {
      const payload = {};

      const result = BaseInsertPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      // Should generate default ID
      expect((result as typeof BaseInsertPayloadSchema.inferOut).id).toMatch(
        /^act_/
      );
    });

    test('should generate default ID when not provided', () => {
      const payload = {
        performedBy: {
          type: 'system' as const,
          identifier: 'auto-process',
        },
      };

      const result = BaseInsertPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect((result as typeof BaseInsertPayloadSchema.inferOut).id).toMatch(
        /^act_/
      );
    });
  });

  describe('BaseUpdatePayloadSchema', () => {
    test('should accept update with performer', () => {
      const payload = {
        performedBy: {
          type: 'automation' as const,
          identifier: 'scheduled-task',
        },
        metadata: { updated: true },
      };

      const result = BaseUpdatePayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should accept empty update payload', () => {
      const payload = {};

      const result = BaseUpdatePayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should accept update with only metadata', () => {
      const payload = {
        metadata: { version: '2.0' },
      };

      const result = BaseUpdatePayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });
  });
});
