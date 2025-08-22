import { describe, expect, test } from 'vitest';
import { RequiredDatePayloadSchema, RequiredDateSchema } from './dates.js';

describe('Common - Dates', () => {
  describe('Date Schema', () => {
    test('should accept an iso string', async () => {
      const result = RequiredDateSchema.safeParse(new Date().toISOString());

      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeInstanceOf(Date);
      }
    });

    test('should accept a Date object', async () => {
      const result = RequiredDateSchema.safeParse(new Date());

      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBeInstanceOf(Date);
      }
    });
  });

  describe('Payload Schema', () => {
    test('should parse a Date to an ISO string', async () => {
      const iso = new Date().toISOString();

      const result = RequiredDatePayloadSchema.safeParse(new Date(iso));

      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(iso);
      }
    });

    test('should parse an ISO to an ISO string', async () => {
      const iso = new Date().toISOString();

      const result = RequiredDatePayloadSchema.safeParse(iso);

      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(iso);
      }
    });
  });
});
