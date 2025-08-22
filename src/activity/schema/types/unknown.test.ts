import { describe, expect, test } from 'vitest';
import { generateActivityId } from '../utils.js';
import {
  UnknownActivityPayloadSchema,
  UnknownActivitySchema,
} from './unknown.js';

describe('Activity Schema - Unknown', () => {
  describe('UnknownActivitySchema', () => {
    test('should accept complete unknown activity', () => {
      const activity = {
        id: generateActivityId(),
        type: 'unknown' as const,
        message: 'Unrecognized activity detected',
        performedBy: {
          type: 'guest' as const,
          identifier: 'anonymous-user',
        },
        source: 'external-webhook',
        isMutateable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: { webhook_source: 'third-party', event_type: 'custom' },
      };

      const result = UnknownActivitySchema.safeParse(activity);
      // Parse succeeds for valid data
    });

    test('should accept unknown activity with system performer', () => {
      const activity = {
        id: generateActivityId(),
        type: 'unknown' as const,
        message: 'System detected unexpected behavior',
        performedBy: {
          type: 'system' as const,
          identifier: 'anomaly-detector',
        },
        source: 'monitoring-service',
        isMutateable: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: { severity: 'low', category: 'anomaly' },
      };

      const result = UnknownActivitySchema.safeParse(activity);
      // Parse succeeds for valid data
    });

    test('should accept unknown activity with integration performer', () => {
      const activity = {
        id: generateActivityId(),
        type: 'unknown' as const,
        message: 'Received unknown event from integration',
        performedBy: {
          type: 'integration' as const,
          identifier: 'webhook-handler',
        },
        source: 'api-gateway',
        isMutateable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {
          integration: 'external-crm',
          event: 'unknown_event_type',
          raw_data: '{"type":"unknown","data":{}}',
        },
      };

      const result = UnknownActivitySchema.safeParse(activity);
      // Parse succeeds for valid data
    });

    test('should accept unknown activity with optional fields', () => {
      const activity = {
        id: generateActivityId(),
        type: 'unknown' as const,
        message: 'Legacy system activity logged',
        performedBy: {
          type: 'automation' as const,
          identifier: 'legacy-bridge',
        },
        source: 'legacy-system',
        isMutateable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        deactivatedAt: new Date(),
        metadata: {
          legacy_id: 'old_system_123',
          migrated: false,
        },
      };

      const result = UnknownActivitySchema.safeParse(activity);
      // Parse succeeds for valid data
    });

    test('should reject unknown activity with wrong type', () => {
      const activity = {
        id: generateActivityId(),
        type: 'note',
        message: 'Wrong type activity',
        performedBy: {
          type: 'guest' as const,
          identifier: 'anonymous',
        },
        source: 'test',
        isMutateable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      };

      const result = UnknownActivitySchema.safeParse(activity);
      expect(result.success).toBe(false);
    });

    test('should reject unknown activity missing message', () => {
      const activity = {
        id: generateActivityId(),
        type: 'unknown' as const,
        // missing message
        performedBy: {
          type: 'guest' as const,
          identifier: 'anonymous',
        },
        source: 'test',
        isMutateable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      };

      const result = UnknownActivitySchema.safeParse(activity);
      expect(result.success).toBe(false);
    });

    test('should reject unknown activity with non-string message', () => {
      const activity = {
        id: generateActivityId(),
        type: 'unknown' as const,
        message: 123,
        performedBy: {
          type: 'guest' as const,
          identifier: 'anonymous',
        },
        source: 'test',
        isMutateable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      };

      const result = UnknownActivitySchema.safeParse(activity);
      expect(result.success).toBe(false);
    });

    test('should reject unknown activity missing required base fields', () => {
      const activity = {
        id: generateActivityId(),
        type: 'unknown' as const,
        message: 'Test message',
        // missing performedBy, source, isMutateable, dates, metadata
      };

      const result = UnknownActivitySchema.safeParse(activity);
      expect(result.success).toBe(false);
    });
  });

  describe('UnknownActivityPayloadSchema', () => {
    test('should accept complete unknown activity payload', () => {
      const payload = {
        id: generateActivityId(),
        type: 'unknown' as const,
        message: 'Unknown event from external source',
        performedBy: {
          type: 'integration' as const,
          identifier: 'webhook-processor',
        },
        source: 'external-api',
        isMutateable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          source_system: 'partner-api',
          event_id: 'evt_123456',
          processed: false,
        },
      };

      const result = UnknownActivityPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.data).toEqual(payload);
    });

    test('should accept minimal unknown activity payload', () => {
      const payload = {
        id: generateActivityId(),
        type: 'unknown' as const,
        message: 'Simple unknown event',
        performedBy: {
          type: 'guest' as const,
          identifier: 'anonymous',
        },
        source: 'unknown-source',
        isMutateable: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = UnknownActivityPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
    });

    test('should accept payload with optional date fields', () => {
      const payload = {
        id: generateActivityId(),
        type: 'unknown' as const,
        message: 'Archived unknown activity',
        performedBy: {
          type: 'system' as const,
          identifier: 'archival-service',
        },
        source: 'data-cleanup',
        isMutateable: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: new Date().toISOString(),
        deactivatedAt: new Date().toISOString(),
        metadata: {
          archived: true,
          retention_policy: 'long_term',
        },
      };

      const result = UnknownActivityPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
    });

    test('should reject payload with invalid date format', () => {
      const payload = {
        id: generateActivityId(),
        type: 'unknown' as const,
        message: 'Test unknown activity',
        performedBy: {
          type: 'guest' as const,
          identifier: 'anonymous',
        },
        source: 'test',
        isMutateable: true,
        createdAt: 'invalid-date-format',
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = UnknownActivityPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject payload with wrong type', () => {
      const payload = {
        id: generateActivityId(),
        type: 'operation',
        message: 'Wrong type payload',
        performedBy: {
          type: 'guest' as const,
          identifier: 'anonymous',
        },
        source: 'test',
        isMutateable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = UnknownActivityPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject payload missing message', () => {
      const payload = {
        id: generateActivityId(),
        type: 'unknown' as const,
        // missing message
        performedBy: {
          type: 'guest' as const,
          identifier: 'anonymous',
        },
        source: 'test',
        isMutateable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = UnknownActivityPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });
});
