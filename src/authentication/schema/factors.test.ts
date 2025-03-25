import { type } from 'arktype';
import { describe, expect, test } from 'vitest';
import {
  AuthenticationFactorPayloadSchema,
  AuthenticationFactorsPayloadSchema,
  UpsertAuthenticationFactorsPayloadSchema,
} from './factors.js';

describe('Authentication - Factors', () => {
  describe('Schema', () => {
    test('should parse response payload successfully', async () => {
      expect(
        AuthenticationFactorsPayloadSchema({
          createdAt: new Date(),
          updatedAt: new Date(),
          factors: [
            {
              id: '123',
            },
          ],
        })
      ).not.toBeInstanceOf(type.errors);

      // Undefined factors
      expect(
        AuthenticationFactorsPayloadSchema({
          createdAt: new Date(),
          updatedAt: new Date(),
          factors: undefined,
        })
      ).not.toBeInstanceOf(type.errors);
    });

    test('should parse upsert payload successfully', async () => {
      expect(
        UpsertAuthenticationFactorsPayloadSchema({
          factors: [
            {
              id: '123',
            },
          ],
        })
      ).not.toBeInstanceOf(type.errors);

      // Null factors
      expect(
        UpsertAuthenticationFactorsPayloadSchema({
          factors: null,
        })
      ).not.toBeInstanceOf(type.errors);

      // Undefined factors
      expect(
        UpsertAuthenticationFactorsPayloadSchema({
          factors: undefined,
        })
      ).not.toBeInstanceOf(type.errors);
    });

    test('should throw error for invalid factors', async () => {
      // Factor object
      expect(
        AuthenticationFactorsPayloadSchema({
          createdAt: new Date(),
          updatedAt: new Date(),
          factors: { id: '123' },
        })
      ).toBeInstanceOf(type.errors);

      // Factor array of string
      expect(
        AuthenticationFactorsPayloadSchema({
          createdAt: new Date(),
          updatedAt: new Date(),
          factors: ['123'],
        })
      ).toBeInstanceOf(type.errors);
    });

    test('should accept various next factors types', async () => {
      // Undefined
      expect(
        AuthenticationFactorPayloadSchema({
          id: '123',
          nextFactors: undefined,
        })
      ).not.toBeInstanceOf(type.errors);

      // Array
      expect(
        AuthenticationFactorPayloadSchema({
          id: '123',
          nextFactors: [
            {
              id: '456',
            },
          ],
        })
      ).not.toBeInstanceOf(type.errors);

      // Deeply nested array
      expect(
        AuthenticationFactorPayloadSchema({
          id: '123',
          nextFactors: [
            {
              id: '456',
              nextFactors: [
                {
                  id: '456',
                  nextFactors: [
                    {
                      id: '456',
                    },
                  ],
                },
              ],
            },
          ],
        })
      ).not.toBeInstanceOf(type.errors);
    });

    test('should throw error for invalid factor id', async () => {
      // Number
      expect(
        AuthenticationFactorsPayloadSchema({
          id: 123,
        })
      ).toBeInstanceOf(type.errors);

      // Null
      expect(
        AuthenticationFactorsPayloadSchema({
          id: null,
        })
      ).toBeInstanceOf(type.errors);

      // Undefined
      expect(
        AuthenticationFactorsPayloadSchema({
          id: undefined,
        })
      ).toBeInstanceOf(type.errors);
    });

    test('should throw error for invalid next factors', async () => {
      // String
      expect(
        AuthenticationFactorsPayloadSchema({
          id: '123',
          nextFactors: '123',
        })
      ).toBeInstanceOf(type.errors);

      // Object
      expect(
        AuthenticationFactorsPayloadSchema({
          id: '123',
          nextFactors: { id: '123' },
        })
      ).toBeInstanceOf(type.errors);

      // Array
      expect(
        AuthenticationFactorsPayloadSchema({
          id: '123',
          nextFactors: ['123'],
        })
      ).toBeInstanceOf(type.errors);
    });
  });
});
