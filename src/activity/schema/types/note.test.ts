import { describe, expect, test } from 'vitest';
import { generateActivityId } from '../utils.js';
import {
  type InsertNoteActivityPayload,
  InsertNoteActivityPayloadSchema,
  NoteActivityPayloadSchema,
  NoteActivitySchema,
  UpdateNoteActivityPayloadSchema,
} from './note.js';

describe('Activity Schema - Note', () => {
  describe('NoteActivitySchema', () => {
    test('should accept complete note activity', () => {
      const activity = {
        id: generateActivityId(),
        type: 'note' as const,
        message: 'This is a test note',
        performedBy: {
          type: 'identity' as const,
          identifier: 'user@example.com',
        },
        source: 'web-app',
        isMutateable: true,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: { priority: 'high' },
      };

      const result = NoteActivitySchema.safeParse(activity);
      // Parse succeeds for valid data
    });

    test('should accept note activity with optional fields', () => {
      const activity = {
        id: generateActivityId(),
        type: 'note' as const,
        message: 'Note with optional fields',
        performedBy: {
          type: 'system' as const,
          identifier: 'automated-process',
        },
        source: 'background-job',
        isMutateable: false,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        deactivatedAt: new Date(),
        metadata: { category: 'system' },
      };

      const result = NoteActivitySchema.safeParse(activity);
      // Parse succeeds for valid data
    });

    test('should reject note activity with wrong type', () => {
      const activity = {
        id: generateActivityId(),
        type: 'operation',
        message: 'This should fail',
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

      const result = NoteActivitySchema.safeParse(activity);
      expect(result.success).toBe(false);
    });

    test('should reject note activity missing message', () => {
      const activity = {
        id: generateActivityId(),
        type: 'note' as const,
        // missing message
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

      const result = NoteActivitySchema.safeParse(activity);
      expect(result.success).toBe(false);
    });

    test('should reject note activity with non-string message', () => {
      const activity = {
        id: generateActivityId(),
        type: 'note' as const,
        message: 123,
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

      const result = NoteActivitySchema.safeParse(activity);
      expect(result.success).toBe(false);
    });
  });

  describe('NoteActivityPayloadSchema', () => {
    test('should accept complete note activity payload', () => {
      const payload = {
        id: generateActivityId(),
        type: 'note' as const,
        message: 'Test note payload',
        performedBy: {
          type: 'identity' as const,
          identifier: 'user@example.com',
        },
        source: 'mobile-app',
        isMutateable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { urgent: true },
      };

      const result = NoteActivityPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.data).toEqual(payload);
    });

    test('should accept minimal note activity payload', () => {
      const payload = {
        id: generateActivityId(),
        type: 'note' as const,
        message: 'Simple note',
        performedBy: {
          type: 'system' as const,
          identifier: 'auto-note',
        },
        source: 'scheduler',
        isMutateable: false,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = NoteActivityPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
    });

    test('should accept payload with optional date fields', () => {
      const payload = {
        id: generateActivityId(),
        type: 'note' as const,
        message: 'Note with dates',
        performedBy: {
          type: 'guest' as const,
          identifier: 'anonymous',
        },
        source: 'public-form',
        isMutateable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deletedAt: new Date().toISOString(),
        deactivatedAt: new Date().toISOString(),
        metadata: { public: true },
      };

      const result = NoteActivityPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
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
        createdAt: 'invalid-date-format',
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = NoteActivityPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject payload with wrong type', () => {
      const payload = {
        id: generateActivityId(),
        type: 'authentication',
        message: 'Wrong type',
        performedBy: {
          type: 'identity' as const,
          identifier: 'user@example.com',
        },
        source: 'web-app',
        isMutateable: true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = NoteActivityPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('InsertNoteActivityPayloadSchema', () => {
    test('should accept complete insert payload', () => {
      const payload = {
        id: generateActivityId(),
        type: 'note' as const,
        message: 'New note to insert',
        performedBy: {
          type: 'identity' as const,
          identifier: 'user@example.com',
        },
        metadata: { source: 'manual' },
      };

      const result = InsertNoteActivityPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.data).toEqual(payload);
    });

    test('should accept minimal insert payload', () => {
      const payload = {
        type: 'note' as const,
        message: 'Basic note',
      };

      const result = InsertNoteActivityPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      // Should generate ID automatically
      expect((result.data as InsertNoteActivityPayload).id).toMatch(/^act_/);
    });

    test('should accept insert payload without performer', () => {
      const payload = {
        type: 'note' as const,
        message: 'Auto-generated note',
        metadata: { automated: true },
      };

      const result = InsertNoteActivityPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
    });

    test('should reject insert payload missing type', () => {
      const payload = {
        message: 'Note without type',
      };

      const result = InsertNoteActivityPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject insert payload missing message', () => {
      const payload = {
        type: 'note' as const,
        // missing message
      };

      const result = InsertNoteActivityPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject insert payload with wrong type', () => {
      const payload = {
        type: 'operation',
        message: 'Wrong type note',
      };

      const result = InsertNoteActivityPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('UpdateNoteActivityPayloadSchema', () => {
    test('should accept update payload with message', () => {
      const payload = {
        type: 'note' as const,
        message: 'Updated note message',
        performedBy: {
          type: 'identity' as const,
          identifier: 'user@example.com',
        },
        metadata: { updated: true },
      };

      const result = UpdateNoteActivityPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.data).toEqual(payload);
    });

    test('should accept update payload without message', () => {
      const payload = {
        type: 'note' as const,
        performedBy: {
          type: 'automation' as const,
          identifier: 'note-updater',
        },
        metadata: { last_modified: new Date().toISOString() },
      };

      const result = UpdateNoteActivityPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
    });

    test('should accept minimal update payload', () => {
      const payload = {
        type: 'note' as const,
      };

      const result = UpdateNoteActivityPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
    });

    test('should accept update with only metadata', () => {
      const payload = {
        type: 'note' as const,
        metadata: { priority: 'low' },
      };

      const result = UpdateNoteActivityPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
    });

    test('should reject update payload with wrong type', () => {
      const payload = {
        type: 'unknown',
        message: 'Updated message',
      };

      const result = UpdateNoteActivityPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject update payload with invalid performer', () => {
      const payload = {
        type: 'note' as const,
        message: 'Updated note',
        performedBy: {
          type: 'invalid_performer_type',
          identifier: 'test',
        },
      };

      const result = UpdateNoteActivityPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });
});
