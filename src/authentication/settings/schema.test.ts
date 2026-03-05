import { describe, expect, test } from 'vitest';
import { generateStrategyId } from '../utils.js';
import {
  SettingsSchema,
  SettingsPayloadSchema,
  UpsertSettingsPayloadSchema,
} from './schema.js';

describe('Authentication Settings - Schema', () => {
  describe('SettingsSchema', () => {
    test('should accept minimal settings object', () => {
      const settings = {
        updatedAt: new Date(),
        metadata: {},
      };

      const result = SettingsSchema.safeParse(settings);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
    });

    test('should accept settings without dates (all dates are optional)', () => {
      const settings = {
        metadata: {},
      };

      const result = SettingsSchema.safeParse(settings);
      expect(result.success).toBe(true);
    });

    test('should accept settings with factors', () => {
      const settings = {
        factors: [
          {
            id: generateStrategyId(),
          },
        ],
        updatedAt: new Date(),
        metadata: {},
      };

      const result = SettingsSchema.safeParse(settings);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.factors).toHaveLength(1);
        expect(result.data.factors?.[0].id).toMatch(/^stg_[A-Za-z0-9]+$/);
      }
    });

    test('should accept settings with nested factors', () => {
      const settings = {
        factors: [
          {
            id: generateStrategyId(),
            nextFactors: [
              {
                id: generateStrategyId(),
              },
            ],
          },
        ],
        updatedAt: new Date(),
        metadata: {},
      };

      const result = SettingsSchema.safeParse(settings);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.factors?.[0].nextFactors).toHaveLength(1);
      }
    });

    test('should accept settings with undefined factors', () => {
      const settings = {
        factors: undefined,
        updatedAt: new Date(),
        metadata: {},
      };

      const result = SettingsSchema.safeParse(settings);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.factors).toBeUndefined();
      }
    });

    test('should accept settings with null factors (transforms to undefined)', () => {
      const settings = {
        factors: null,
        updatedAt: new Date(),
        metadata: {},
      };

      const result = SettingsSchema.safeParse(settings);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.factors).toBeUndefined();
      }
    });

    test('should accept settings with multiple factors', () => {
      const settings = {
        factors: [
          { id: generateStrategyId() },
          { id: generateStrategyId() },
          { id: generateStrategyId() },
        ],
        updatedAt: new Date(),
        metadata: {},
      };

      const result = SettingsSchema.safeParse(settings);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.factors).toHaveLength(3);
      }
    });

    test('should accept settings with deeply nested factors', () => {
      const settings = {
        factors: [
          {
            id: generateStrategyId(),
            nextFactors: [
              {
                id: generateStrategyId(),
                nextFactors: [
                  {
                    id: generateStrategyId(),
                  },
                ],
              },
            ],
          },
        ],
        updatedAt: new Date(),
        metadata: {},
      };

      const result = SettingsSchema.safeParse(settings);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(
          result.data.factors?.[0].nextFactors?.[0].nextFactors
        ).toHaveLength(1);
      }
    });

    test('should reject settings with invalid factor id', () => {
      const settings = {
        factors: [
          {
            id: 'invalid-id',
          },
        ],
        updatedAt: new Date(),
        metadata: {},
      };

      const result = SettingsSchema.safeParse(settings);
      expect(result.success).toBe(false);
    });

    test('should reject settings with factors as object instead of array', () => {
      const settings = {
        factors: { id: generateStrategyId() },
        updatedAt: new Date(),
        metadata: {},
      };

      const result = SettingsSchema.safeParse(settings);
      expect(result.success).toBe(false);
    });

    test('should accept settings with deletedAt', () => {
      const settings = {
        updatedAt: new Date(),
        deletedAt: new Date(),
        metadata: {},
      };

      const result = SettingsSchema.safeParse(settings);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.deletedAt).toBeDefined();
      }
    });

    test('should accept settings with deactivatedAt', () => {
      const settings = {
        updatedAt: new Date(),
        deactivatedAt: new Date(),
        metadata: {},
      };

      const result = SettingsSchema.safeParse(settings);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.deactivatedAt).toBeDefined();
      }
    });
  });

  describe('SettingsPayloadSchema', () => {
    test('should accept minimal payload', () => {
      const payload = {
        metadata: {},
      };

      const result = SettingsPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(payload);
      }
    });

    test('should accept payload with optional dates', () => {
      const payload = {
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = SettingsPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
    });

    test('should accept empty payload', () => {
      const payload = {
        // Schema might have defaults for metadata
      };

      const result = SettingsPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
    });

    test('should accept payload with factors', () => {
      const payload = {
        factors: [
          {
            id: generateStrategyId(),
          },
        ],
        metadata: {},
      };

      const result = SettingsPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.factors).toHaveLength(1);
      }
    });

    test('should accept payload with nested factors', () => {
      const payload = {
        factors: [
          {
            id: generateStrategyId(),
            nextFactors: [
              {
                id: generateStrategyId(),
                nextFactors: [
                  {
                    id: generateStrategyId(),
                  },
                ],
              },
            ],
          },
        ],
        metadata: {},
      };

      const result = SettingsPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.factors?.[0].nextFactors).toBeDefined();
      }
    });

    test('should accept payload with null factors (transforms to undefined)', () => {
      const payload = {
        factors: null,
        metadata: {},
      };

      const result = SettingsPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.factors).toBeUndefined();
      }
    });

    test('should accept payload with undefined factors', () => {
      const payload = {
        factors: undefined,
        metadata: {},
      };

      const result = SettingsPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.factors).toBeUndefined();
      }
    });

    test('should reject payload with invalid factor structure', () => {
      const payload = {
        factors: [{ id: 123 }],
        metadata: {},
      };

      const result = SettingsPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should accept payload with deletedAt and deactivatedAt', () => {
      const payload = {
        updatedAt: new Date().toISOString(),
        deletedAt: new Date().toISOString(),
        deactivatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = SettingsPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.deletedAt).toBeDefined();
        expect(result.data.deactivatedAt).toBeDefined();
      }
    });
  });

  describe('UpsertSettingsPayloadSchema', () => {
    test('should accept empty upsert payload', () => {
      const payload = {};

      const result = UpsertSettingsPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(payload);
      }
    });

    test('should accept upsert with only metadata', () => {
      const payload = {
        metadata: { configVersion: '2.0' },
      };

      const result = UpsertSettingsPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
    });

    test('should reject invalid factors structure', () => {
      const payload = {
        factors: 'invalid-factors',
      };

      const result = UpsertSettingsPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should accept upsert with factors array', () => {
      const payload = {
        factors: [
          {
            id: generateStrategyId(),
          },
        ],
      };

      const result = UpsertSettingsPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.factors).toHaveLength(1);
      }
    });

    test('should accept upsert with nested factors', () => {
      const payload = {
        factors: [
          {
            id: generateStrategyId(),
            nextFactors: [
              {
                id: generateStrategyId(),
              },
            ],
          },
        ],
      };

      const result = UpsertSettingsPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.factors?.[0].nextFactors).toHaveLength(1);
      }
    });

    test('should accept upsert with multiple top-level factors', () => {
      const payload = {
        factors: [{ id: generateStrategyId() }, { id: generateStrategyId() }],
      };

      const result = UpsertSettingsPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.factors).toHaveLength(2);
      }
    });

    test('should accept upsert with null factors', () => {
      const payload = {
        factors: null,
      };

      const result = UpsertSettingsPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    test('should accept upsert with undefined factors', () => {
      const payload = {
        factors: undefined,
      };

      const result = UpsertSettingsPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    test('should accept upsert with deeply nested factors', () => {
      const payload = {
        factors: [
          {
            id: generateStrategyId(),
            nextFactors: [
              {
                id: generateStrategyId(),
                nextFactors: [
                  {
                    id: generateStrategyId(),
                    nextFactors: [
                      {
                        id: generateStrategyId(),
                      },
                    ],
                  },
                ],
              },
            ],
          },
        ],
      };

      const result = UpsertSettingsPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        const firstFactor = result.data.factors?.[0];
        expect(
          firstFactor?.nextFactors?.[0].nextFactors?.[0].nextFactors
        ).toHaveLength(1);
      }
    });

    test('should reject upsert with invalid factor id type', () => {
      const payload = {
        factors: [
          {
            id: 12345,
          },
        ],
      };

      const result = UpsertSettingsPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject upsert with factors as single object', () => {
      const payload = {
        factors: {
          id: generateStrategyId(),
        },
      };

      const result = UpsertSettingsPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject upsert with invalid nextFactors type', () => {
      const payload = {
        factors: [
          {
            id: generateStrategyId(),
            nextFactors: 'invalid',
          },
        ],
      };

      const result = UpsertSettingsPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should accept upsert with factors and metadata together', () => {
      const payload = {
        factors: [
          {
            id: generateStrategyId(),
          },
        ],
        metadata: { key: 'value' },
      };

      const result = UpsertSettingsPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.factors).toHaveLength(1);
        expect(result.data.metadata).toEqual({ key: 'value' });
      }
    });

    test('should accept upsert with empty factors array', () => {
      const payload = {
        factors: [],
      };

      const result = UpsertSettingsPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.factors).toHaveLength(0);
      }
    });
  });
});
