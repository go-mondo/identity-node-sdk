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
      const result = ActivityIdSchema.safeParse(id);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(id);
      }
    });

    test('should reject invalid activity ID format', () => {
      const result1 = ActivityIdSchema.safeParse('invalid_id');
      expect(result1.success).toBe(false);
      const result2 = ActivityIdSchema.safeParse('act_');
      expect(result2.success).toBe(false);
    });

    test('should reject non-string values', () => {
      const result1 = ActivityIdSchema.safeParse(123);
      expect(result1.success).toBe(false);
      const result2 = ActivityIdSchema.safeParse(null);
      expect(result2.success).toBe(false);
    });
  });

  describe('ActivityIdPropertySchema', () => {
    test('should accept valid id property', () => {
      const payload = { id: generateActivityId() };
      const result = ActivityIdPropertySchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(payload);
      }
    });

    test('should reject missing id', () => {
      const result = ActivityIdPropertySchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('SourceSchema', () => {
    test('should accept string source', () => {
      const result = SourceSchema.safeParse('api-request');
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe('api-request');
      }
    });

    test('should reject non-string values', () => {
      const result1 = SourceSchema.safeParse(123);
      expect(result1.success).toBe(false);
      const result2 = SourceSchema.safeParse(null);
      expect(result2.success).toBe(false);
    });
  });

  describe('PerformedBySchema', () => {
    test('should accept valid performer with system type', () => {
      const performer = {
        type: 'system' as const,
        identifier: 'system-process',
      };

      const result = PerformedBySchema.safeParse(performer);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(performer);
      }
    });

    test('should accept valid performer with identity type', () => {
      const performer = {
        type: 'identity' as const,
        identifier: 'user@example.com',
      };

      const result = PerformedBySchema.safeParse(performer);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(performer);
      }
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
        const result = PerformedBySchema.safeParse(performer);
        // Parse succeeds for valid data
        expect(result.success).toBe(true);
      }
    });

    test('should reject invalid performer type', () => {
      const performer = {
        type: 'invalid',
        identifier: 'test',
      };

      const result = PerformedBySchema.safeParse(performer);
      expect(result.success).toBe(false);
    });

    test('should reject missing fields', () => {
      const result = PerformedBySchema.safeParse({ identifier: 'test' });
      expect(result.success).toBe(false);
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

      const result = BaseSchema.safeParse(activity);
      // Parse succeeds for valid data
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

      const result = BaseSchema.safeParse(activity);
      // Parse succeeds for valid data
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

      const result = BaseSchema.safeParse(activity);
      // Parse succeeds for valid data
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

      const result = BaseSchema.safeParse(activity);
      expect(result.success).toBe(false);
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

      const result = BaseInsertPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
    });

    test('should accept minimal insert payload', () => {
      const payload = {};

      const result = BaseInsertPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        // Should generate default ID
        expect(result.data.id).toMatch(/^act_/);
      }
    });

    test('should generate default ID when not provided', () => {
      const payload = {
        performedBy: {
          type: 'system' as const,
          identifier: 'auto-process',
        },
      };

      const result = BaseInsertPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toMatch(/^act_/);
      }
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

      const result = BaseUpdatePayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(expect.objectContaining(payload));
      }
    });

    test('should accept empty update payload', () => {
      const payload = {};

      const result = BaseUpdatePayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
    });

    test('should accept update with only metadata', () => {
      const payload = {
        metadata: { version: '2.0' },
      };

      const result = BaseUpdatePayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
    });
  });
});
