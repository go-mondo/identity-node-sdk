import { type } from 'arktype';
import { describe, expect, test } from 'vitest';
import {
  InsertUserPayloadSchema,
  UserPayloadSchema,
  UserStatus,
} from './user.js';

describe('Customer - User', () => {
  describe('User Payload', () => {
    test('should parse attributes successfully', async () => {
      const item = {
        foo: 'bar',
        id: '123',
        phoneNumber: '123',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = UserPayloadSchema(
        item
      ) as typeof UserPayloadSchema.inferOut;

      if (result instanceof type.errors) {
        console.log(result.summary);
      }

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result?.metadata).to.undefined;
    });
  });

  describe('Insert User Payload', () => {
    test('should parse attributes successfully', async () => {
      const item = {
        foo: 'bar',
        id: '123',
        phoneNumber: '123',
      };

      const result = InsertUserPayloadSchema(
        item
      ) as typeof InsertUserPayloadSchema.inferOut;

      if (result instanceof type.errors) {
        console.log(result.summary);
      }

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result?.metadata).to.undefined;
    });

    test('should serialize successfully', async () => {
      const item = {
        foo: 'bar',
        id: '123',
        phoneNumber: '123',
        metadata: new Map(),
        // status: UserStatus.ACTIVE,
        // createdAt: new Date(),
        // updatedAt: new Date(),
      };

      const result = InsertUserPayloadSchema(
        item
      ) as typeof InsertUserPayloadSchema.inferOut;

      if (result instanceof type.errors) {
        console.log(result.summary);
      }

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result?.metadata).to.null;
    });
  });
});
