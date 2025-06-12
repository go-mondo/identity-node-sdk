import { type } from 'arktype';
import { describe, expect, test } from 'vitest';
import {
  InsertUserPayloadSchema,
  UserPayloadSchema,
  UserStatus,
} from './schema.js';

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
        familyName: 'Foo',
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
      expect(result?.familyName).to.equal(item.familyName);
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

    test('should serialize nulls successfully', async () => {
      const payload = {
        id: '123',
        status: 'unverified',
        givenName: null,
        middleName: null,
        familyName: null,
        honorificPrefix: null,
        honorificSuffix: null,
        email: null,
        verifiedEmail: null,
        phoneNumber: null,
        verifiedPhoneNumber: null,
        createdAt: '2025-04-02T03:50:40.812Z',
        updatedAt: '2025-04-02T03:50:40.812Z',
      };

      const result = UserPayloadSchema(payload);

      if (result instanceof type.errors) {
        console.log(result.summary);
      }

      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should serialize nulls successfully', async () => {
      const payload = {
        id: '123',
        status: 'unverified',
        givenName: null,
        middleName: null,
        familyName: null,
        honorificPrefix: null,
        honorificSuffix: null,
        email: null,
        verifiedEmail: null,
        phoneNumber: null,
        verifiedPhoneNumber: null,
        createdAt: '2025-04-02T03:50:40.812Z',
        updatedAt: '2025-04-02T03:50:40.812Z',
      };

      const test = type({
        foo: 'string.numeric.parse',
        bar: 'number',
        baz: 'string.date.iso.parse',
      });

      const result = UserPayloadSchema(payload);

      if (result instanceof type.errors) {
        console.log(result.summary);
      }

      expect(result).not.toBeInstanceOf(type.errors);
    });
  });
});
