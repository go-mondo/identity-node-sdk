import { describe, expect, test } from 'vitest';
import {
  FeatureFlag,
  FeaturePayloadSchema,
  FeaturesPayloadSchema,
  MembershipPayloadSchema,
  MembershipSchema,
} from './schema.js';

describe('Workspace Membership - Schema', () => {
  describe('FeaturePayloadSchema', () => {
    test('should serialize feature expiry date', () => {
      const expiresAt = new Date('2026-04-01T00:00:00.000Z');
      const result = FeaturePayloadSchema.safeParse({ expiresAt });

      expect(result.success).toBe(true);
      expect(result.data?.expiresAt).toBe(expiresAt.toISOString());
    });

    test('should reject invalid expiry dates', () => {
      const result = FeaturePayloadSchema.safeParse({
        expiresAt: 'not-a-date',
      });

      expect(result.success).toBe(false);
    });
  });

  describe('FeaturesPayloadSchema', () => {
    test('should accept supported feature flags', () => {
      const expiresAt = '2026-04-01T00:00:00.000Z';
      const result = FeaturesPayloadSchema.safeParse({
        [FeatureFlag.REMOVE_MEMBERSHIP]: { expiresAt },
        [FeatureFlag.REMOVE_BRANDING]: { expiresAt },
      });

      expect(result.success).toBe(true);
      expect(result.data?.[FeatureFlag.REMOVE_MEMBERSHIP]?.expiresAt).toBe(
        expiresAt
      );
    });
  });

  describe('MembershipSchema', () => {
    test('should accept membership dates and features', () => {
      const startAt = new Date('2026-01-01T00:00:00.000Z');
      const endAt = new Date('2026-12-31T00:00:00.000Z');
      const result = MembershipSchema.safeParse({
        features: {
          [FeatureFlag.REMOVE_BRANDING]: {
            expiresAt: '2026-06-01T00:00:00.000Z',
          },
        },
        startAt,
        endAt,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.startAt).toBe(startAt);
        expect(result.data.endAt).toBe(endAt);
      }
    });

    test('should accept an empty membership', () => {
      const result = MembershipSchema.safeParse({});

      expect(result.success).toBe(true);
      expect(result.data).toEqual({});
    });
  });

  describe('MembershipPayloadSchema', () => {
    test('should serialize membership dates', () => {
      const startAt = new Date('2026-01-01T00:00:00.000Z');
      const endAt = new Date('2026-12-31T00:00:00.000Z');
      const result = MembershipPayloadSchema.safeParse({
        startAt,
        endAt,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.startAt).toBe(startAt.toISOString());
        expect(result.data.endAt).toBe(endAt.toISOString());
      }
    });
  });
});
