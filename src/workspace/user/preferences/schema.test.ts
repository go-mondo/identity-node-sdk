import { describe, expect, test } from 'vitest';
import {
  UpsertUserPreferencesPayloadSchema,
  UserPreferencesPayloadSchema,
  UserPreferencesSchema,
} from './schema.js';

describe('Workspace User Preferences - Schema', () => {
  describe('UserPreferencesSchema', () => {
    test('should accept table view preferences', () => {
      const updatedAt = new Date();
      const preferences = {
        views: {
          users: {
            columns: ['email', 'status', 'createdAt'],
          },
          tenants: {},
        },
        updatedAt,
        deletedAt: new Date(),
        deactivatedAt: new Date(),
        metadata: {
          layout: 'dense',
        },
      };

      const result = UserPreferencesSchema.safeParse(preferences);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.views?.users?.columns).toEqual([
          'email',
          'status',
          'createdAt',
        ]);
        expect(result.data.metadata).toBeInstanceOf(Map);
        expect(result.data.metadata.get('layout')).toBe('dense');
      }
    });

    test('should accept empty preferences', () => {
      const result = UserPreferencesSchema.safeParse({});

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.views).toBeUndefined();
        expect(result.data.metadata).toBeInstanceOf(Map);
      }
    });

    test('should reject non-string column names', () => {
      const result = UserPreferencesSchema.safeParse({
        views: {
          users: {
            columns: ['email', 42],
          },
        },
      });

      expect(result.success).toBe(false);
    });
  });

  describe('UserPreferencesPayloadSchema', () => {
    test('should serialize dates and metadata for payloads', () => {
      const updatedAt = new Date('2026-05-01T00:00:00.000Z');
      const result = UserPreferencesPayloadSchema.safeParse({
        views: {
          users: {
            columns: ['email'],
          },
        },
        updatedAt,
        metadata: new Map<string, string>([['scope', 'workspace']]),
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.updatedAt).toBe(updatedAt.toISOString());
        expect(result.data.metadata).toEqual({ scope: 'workspace' });
      }
    });
  });

  describe('UpsertUserPreferencesPayloadSchema', () => {
    test('should accept partial preference updates', () => {
      const result = UpsertUserPreferencesPayloadSchema.safeParse({
        views: {
          applications: {
            columns: ['name', 'clientId'],
          },
        },
        metadata: {
          updatedBy: 'admin',
        },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.views?.applications?.columns).toEqual([
          'name',
          'clientId',
        ]);
        expect(result.data.metadata).toEqual({ updatedBy: 'admin' });
      }
    });

    test('should normalize empty metadata to null', () => {
      const result = UpsertUserPreferencesPayloadSchema.safeParse({
        metadata: {},
      });

      expect(result.success).toBe(true);
      expect(result.data?.metadata).toBeNull();
    });
  });
});
