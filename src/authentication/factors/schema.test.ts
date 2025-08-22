import { describe, expect, test } from 'vitest';
import { generateStrategyId } from '../utils.js';
import {
  AuthenticationFactorPayloadSchema,
  AuthenticationFactorsPayloadSchema,
  UpsertAuthenticationFactorsPayloadSchema,
} from './schema.js';

describe('Authentication - Factors', () => {
  describe('Schema', () => {
    test('should parse response payload successfully', async () => {
      expect(
        AuthenticationFactorsPayloadSchema.safeParse({
          createdAt: new Date(),
          updatedAt: new Date(),
          factors: [
            {
              id: generateStrategyId(),
            },
          ],
        }).success
      ).toBe(true);

      // Undefined factors
      expect(
        AuthenticationFactorsPayloadSchema.safeParse({
          createdAt: new Date(),
          updatedAt: new Date(),
          factors: undefined,
        }).success
      ).toBe(true);
    });

    test('should parse upsert payload successfully', async () => {
      expect(
        UpsertAuthenticationFactorsPayloadSchema.safeParse({
          factors: [
            {
              id: generateStrategyId(),
            },
          ],
        }).success
      ).toBe(true);

      // Null factors
      expect(
        UpsertAuthenticationFactorsPayloadSchema.safeParse({
          factors: null,
        }).success
      ).toBe(true);

      // Undefined factors
      expect(
        UpsertAuthenticationFactorsPayloadSchema.safeParse({
          factors: undefined,
        }).success
      ).toBe(true);
    });

    test('should throw error for invalid factors', async () => {
      // Factor object
      expect(
        AuthenticationFactorsPayloadSchema.safeParse({
          createdAt: new Date(),
          updatedAt: new Date(),
          factors: { id: generateStrategyId() },
        }).success
      ).toBe(false);

      // Factor array of string
      expect(
        AuthenticationFactorsPayloadSchema.safeParse({
          createdAt: new Date(),
          updatedAt: new Date(),
          factors: [generateStrategyId()],
        }).success
      ).toBe(false);
    });

    test('should accept various next factors types', async () => {
      // Undefined
      expect(
        AuthenticationFactorPayloadSchema.safeParse({
          id: generateStrategyId(),
          nextFactors: undefined,
        }).success
      ).toBe(true);

      // Array
      expect(
        AuthenticationFactorPayloadSchema.safeParse({
          id: generateStrategyId(),
          nextFactors: [
            {
              id: generateStrategyId(),
            },
          ],
        }).success
      ).toBe(true);

      // Deeply nested array
      expect(
        AuthenticationFactorPayloadSchema.safeParse({
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
        }).success
      ).toBe(true);
    });

    test('should throw error for invalid factor id', async () => {
      // Number
      expect(
        AuthenticationFactorPayloadSchema.safeParse({
          id: 123,
        }).success
      ).toBe(false);

      // Null
      expect(
        AuthenticationFactorPayloadSchema.safeParse({
          id: null,
        }).success
      ).toBe(false);

      // Undefined
      expect(
        AuthenticationFactorPayloadSchema.safeParse({
          id: undefined,
        }).success
      ).toBe(false);
    });

    test('should throw error for invalid next factors', async () => {
      // String
      expect(
        AuthenticationFactorPayloadSchema.safeParse({
          id: generateStrategyId(),
          nextFactors: generateStrategyId(),
        }).success
      ).toBe(false);

      // Object
      expect(
        AuthenticationFactorPayloadSchema.safeParse({
          id: generateStrategyId(),
          nextFactors: { id: generateStrategyId() },
        }).success
      ).toBe(false);

      // Array
      expect(
        AuthenticationFactorPayloadSchema.safeParse({
          id: generateStrategyId(),
          nextFactors: [generateStrategyId()],
        }).success
      ).toBe(false);
    });
  });
});
