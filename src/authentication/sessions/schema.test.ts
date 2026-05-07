import { describe, expect, test } from 'vitest';
import { generateSessionId } from '../utils.js';
import {
  SessionPayloadSchema,
  SessionSchema,
  SessionStatus,
} from './schema.js';

describe('Authentication Sessions - Schema', () => {
  const baseSession = {
    id: generateSessionId(),
    status: SessionStatus.INITIATED,
    expiresAt: new Date('2026-01-01T00:00:00.000Z'),
    createdAt: new Date('2025-01-01T00:00:00.000Z'),
    updatedAt: new Date('2025-01-01T00:00:00.000Z'),
    metadata: {},
  };

  describe('redirectPath', () => {
    test('should accept a relative path with query parameters', () => {
      const result = SessionSchema.safeParse({
        ...baseSession,
        redirectPath: '/oauth/authorize?client_id=123',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.redirectPath).toBe('/oauth/authorize?client_id=123');
      }
    });

    test('should accept a payload relative path with query parameters', () => {
      const result = SessionPayloadSchema.safeParse({
        ...baseSession,
        redirectPath: '/oauth/authorize?client_id=123',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.redirectPath).toBe('/oauth/authorize?client_id=123');
      }
    });

    test('should default to root when omitted', () => {
      const result = SessionSchema.safeParse(baseSession);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.redirectPath).toBe('/');
      }
    });

    test('should reject absolute URLs', () => {
      const result = SessionSchema.safeParse({
        ...baseSession,
        redirectPath: 'https://example.com/oauth/authorize?client_id=123',
      });

      expect(result.success).toBe(false);
    });

    test('should reject paths that start with a double slash', () => {
      const result = SessionSchema.safeParse({
        ...baseSession,
        redirectPath: '//example.com/oauth/authorize?client_id=123',
      });

      expect(result.success).toBe(false);
    });

    test('should reject paths that do not start with slash', () => {
      const result = SessionSchema.safeParse({
        ...baseSession,
        redirectPath: 'oauth/authorize?client_id=123',
      });

      expect(result.success).toBe(false);
    });
  });
});
