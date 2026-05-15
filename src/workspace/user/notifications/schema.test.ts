import { describe, expect, test } from 'vitest';
import { generateNotificationId } from '../../utils.js';
import {
  InsertUserNotificationPayloadSchema,
  NotificationType,
  UpdateUserNotificationPayloadSchema,
  UserNotificationIdSchema,
  UserNotificationPayloadSchema,
  UserNotificationSchema,
} from './schema.js';

describe('Workspace User Notifications - Schema', () => {
  describe('UserNotificationIdSchema', () => {
    test('should accept notification IDs', () => {
      const id = generateNotificationId();
      const result = UserNotificationIdSchema.safeParse(id);

      expect(result.success).toBe(true);
      expect(result.data).toBe(id);
    });

    test('should reject IDs with the wrong prefix', () => {
      const result = UserNotificationIdSchema.safeParse(
        'usr_2SVDTvbPaWdRG0CdE9EsVZBjxur'
      );

      expect(result.success).toBe(false);
    });
  });

  describe('UserNotificationSchema', () => {
    test('should accept a complete notification', () => {
      const notification = {
        id: generateNotificationId(),
        type: NotificationType.INFO,
        title: 'Import complete',
        message: 'Your import finished successfully.',
        action: {
          link: 'https://app.example.com/imports/123',
          label: 'View import',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        deactivatedAt: new Date(),
        metadata: {
          importId: 'imp_123',
        },
      };

      const result = UserNotificationSchema.safeParse(notification);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(notification.id);
        expect(result.data.metadata).toBeInstanceOf(Map);
        expect(result.data.metadata.get('importId')).toBe('imp_123');
      }
    });

    test('should reject invalid notification types', () => {
      const result = UserNotificationSchema.safeParse({
        id: generateNotificationId(),
        type: 'warning',
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(result.success).toBe(false);
    });

    test('should reject invalid action links', () => {
      const result = UserNotificationSchema.safeParse({
        id: generateNotificationId(),
        type: NotificationType.INFO,
        action: {
          link: 'not-a-url',
          label: 'Open',
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      expect(result.success).toBe(false);
    });
  });

  describe('UserNotificationPayloadSchema', () => {
    test('should serialize dates and metadata for payloads', () => {
      const createdAt = new Date('2026-05-01T00:00:00.000Z');
      const updatedAt = new Date('2026-05-02T00:00:00.000Z');
      const result = UserNotificationPayloadSchema.safeParse({
        id: generateNotificationId(),
        type: NotificationType.IMPORT,
        createdAt,
        updatedAt,
        metadata: new Map<string, string>([['source', 'import']]),
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.createdAt).toBe(createdAt.toISOString());
        expect(result.data.updatedAt).toBe(updatedAt.toISOString());
        expect(result.data.metadata).toEqual({ source: 'import' });
      }
    });
  });

  describe('InsertUserNotificationPayloadSchema', () => {
    test('should generate an ID for new info notifications', () => {
      const result = InsertUserNotificationPayloadSchema.safeParse({
        type: NotificationType.INFO,
        title: 'Heads up',
        metadata: {
          channel: 'dashboard',
        },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toMatch(/^ntf_[A-Za-z0-9]+$/);
        expect(result.data.metadata).toEqual({ channel: 'dashboard' });
      }
    });

    test('should reject import notifications on insert', () => {
      const result = InsertUserNotificationPayloadSchema.safeParse({
        type: NotificationType.IMPORT,
      });

      expect(result.success).toBe(false);
    });
  });

  describe('UpdateUserNotificationPayloadSchema', () => {
    test('should accept notification updates', () => {
      const result = UpdateUserNotificationPayloadSchema.safeParse({
        message: 'Updated message',
        action: {
          link: 'https://app.example.com/notifications',
          label: 'Open',
        },
        metadata: {},
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.message).toBe('Updated message');
        expect(result.data.metadata).toBeNull();
      }
    });
  });
});
