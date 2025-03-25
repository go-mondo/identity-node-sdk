import { type } from 'arktype';
import { describe, expect, test } from 'vitest';
import { RequiredDatePayloadSchema, RequiredDateSchema } from './dates.js';

describe('Common - Dates', () => {
  describe('Date Schema', () => {
    test('should accept an iso string', async () => {
      const result = RequiredDateSchema(
        new Date().toISOString()
      ) as typeof RequiredDateSchema.inferOut;

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toBeInstanceOf(Date);
    });

    test('should accept a Date object', async () => {
      const result = RequiredDateSchema(
        new Date()
      ) as typeof RequiredDateSchema.inferOut;

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toBeInstanceOf(Date);
    });
  });

  describe('Payload Schema', () => {
    test('should parse a Date to an ISO string', async () => {
      const iso = new Date().toISOString();

      const result = RequiredDatePayloadSchema(
        new Date(iso)
      ) as typeof RequiredDatePayloadSchema.inferOut;

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).to.equal(iso);
    });

    test('should parse an ISO to an ISO string', async () => {
      const iso = new Date().toISOString();

      const result = RequiredDatePayloadSchema(
        iso
      ) as typeof RequiredDatePayloadSchema.inferOut;

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).to.equal(iso);
    });
  });
});
