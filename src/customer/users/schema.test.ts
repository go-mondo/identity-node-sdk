import { describe, expect, test } from 'vitest';
import { generateUserId } from '../schema.js';
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
        id: generateUserId(),
        phoneNumber: '123',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = UserPayloadSchema.safeParse(item);

      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.metadata).toBeUndefined();
      }
    });
  });

  describe('Insert User Payload', () => {
    test('should parse attributes successfully', async () => {
      const item = {
        foo: 'bar',
        id: generateUserId(),
        familyName: 'Foo',
        phoneNumber: '123',
      };

      const result = InsertUserPayloadSchema.safeParse(item);

      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.metadata).toBeUndefined();
        expect(result.data.familyName).toBe(item.familyName);
      }
    });

    test('should serialize successfully', async () => {
      const item = {
        foo: 'bar',
        id: generateUserId(),
        phoneNumber: '123',
        metadata: new Map(),
      };

      const result = InsertUserPayloadSchema.safeParse(item);

      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.metadata).toBeNull();
      }
    });

    test('should serialize nulls successfully', async () => {
      const payload = {
        id: generateUserId(),
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

      const result = UserPayloadSchema.safeParse(payload);

      // Parse succeeds for valid data
      expect(result.success).toBe(true);
    });

    test('should serialize nulls successfully', async () => {
      const payload = {
        id: generateUserId(),
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

      const result = UserPayloadSchema.safeParse(payload);

      // Parse succeeds for valid data
      expect(result.success).toBe(true);
    });
  });
});
