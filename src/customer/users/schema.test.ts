import { describe, expect, test } from 'vitest';
import { generateUserId } from '../schema.js';
import {
  EmailOrPhonePropertiesSchema,
  InsertUserPayloadSchema,
  UnverifiedEmailOrPhonePropertiesSchema,
  UpdateUserNamePropertiesSchema,
  UpdateUserPayloadSchema,
  UserAssociationReferenceSchema,
  UserNamePropertiesSchema,
  UserPayloadSchema,
  UserSchema,
  UserStatus,
  UserStatusSchema,
  VerifiableAttribute,
  VerifiedEmailOrPhonePropertiesSchema,
} from './schema.js';

describe('Customer - User', () => {
  describe('VerifiableAttribute', () => {
    test('should have correct constants', () => {
      expect(VerifiableAttribute.EMAIL).toBe('email');
      expect(VerifiableAttribute.PHONE_NUMBER).toBe('phoneNumber');
    });
  });

  describe('UserStatus', () => {
    test('should have correct constants', () => {
      expect(UserStatus.ACTIVE).toBe('active');
      expect(UserStatus.SUSPENDED).toBe('suspended');
      expect(UserStatus.UNVERIFIED).toBe('unverified');
    });

    test('should parse valid status values', () => {
      expect(UserStatusSchema.safeParse('active').success).toBe(true);
      expect(UserStatusSchema.safeParse('suspended').success).toBe(true);
      expect(UserStatusSchema.safeParse('unverified').success).toBe(true);
    });

    test('should reject invalid status values', () => {
      expect(UserStatusSchema.safeParse('invalid').success).toBe(false);
      expect(UserStatusSchema.safeParse('').success).toBe(false);
    });
  });

  describe('UserNamePropertiesSchema', () => {
    test('should parse valid name properties', () => {
      const result = UserNamePropertiesSchema.safeParse({
        givenName: 'John',
        middleName: 'Robert',
        familyName: 'Doe',
        honorificPrefix: 'Dr.',
        honorificSuffix: 'Jr.',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.givenName).toBe('John');
        expect(result.data.familyName).toBe('Doe');
      }
    });

    test('should transform null values to undefined', () => {
      const result = UserNamePropertiesSchema.safeParse({
        givenName: null,
        familyName: null,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.givenName).toBeUndefined();
        expect(result.data.familyName).toBeUndefined();
      }
    });

    test('should allow empty object', () => {
      const result = UserNamePropertiesSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('UpdateUserNamePropertiesSchema', () => {
    test('should parse valid name properties', () => {
      const result = UpdateUserNamePropertiesSchema.safeParse({
        givenName: 'Jane',
        familyName: 'Smith',
      });
      expect(result.success).toBe(true);
    });

    test('should allow null values without transforming', () => {
      const result = UpdateUserNamePropertiesSchema.safeParse({
        givenName: null,
        familyName: 'Smith',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.givenName).toBeNull();
      }
    });
  });

  describe('VerifiedEmailOrPhonePropertiesSchema', () => {
    test('should parse valid verified email', () => {
      const result = VerifiedEmailOrPhonePropertiesSchema.safeParse({
        verifiedEmail: 'test@example.com',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.verifiedEmail).toBe('test@example.com');
      }
    });

    test('should parse valid verified phone number', () => {
      const result = VerifiedEmailOrPhonePropertiesSchema.safeParse({
        verifiedPhoneNumber: '+1234567890',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.verifiedPhoneNumber).toBe('+1234567890');
      }
    });

    test('should parse both fields together', () => {
      const result = VerifiedEmailOrPhonePropertiesSchema.safeParse({
        verifiedEmail: 'verified@example.com',
        verifiedPhoneNumber: '+1111111111',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.verifiedEmail).toBe('verified@example.com');
        expect(result.data.verifiedPhoneNumber).toBe('+1111111111');
      }
    });

    test('should transform null values to undefined', () => {
      const result = VerifiedEmailOrPhonePropertiesSchema.safeParse({
        verifiedEmail: null,
        verifiedPhoneNumber: null,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.verifiedEmail).toBeUndefined();
        expect(result.data.verifiedPhoneNumber).toBeUndefined();
      }
    });

    test('should reject invalid email format', () => {
      const result = VerifiedEmailOrPhonePropertiesSchema.safeParse({
        verifiedEmail: 'not-an-email',
      });
      expect(result.success).toBe(false);
    });

    test('should allow empty object', () => {
      const result = VerifiedEmailOrPhonePropertiesSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('UnverifiedEmailOrPhonePropertiesSchema', () => {
    test('should parse valid unverified email', () => {
      const result = UnverifiedEmailOrPhonePropertiesSchema.safeParse({
        unverifiedEmail: 'pending@example.com',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.unverifiedEmail).toBe('pending@example.com');
      }
    });

    test('should parse valid unverified phone number', () => {
      const result = UnverifiedEmailOrPhonePropertiesSchema.safeParse({
        unverifiedPhoneNumber: '+0987654321',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.unverifiedPhoneNumber).toBe('+0987654321');
      }
    });

    test('should parse both fields together', () => {
      const result = UnverifiedEmailOrPhonePropertiesSchema.safeParse({
        unverifiedEmail: 'pending@example.com',
        unverifiedPhoneNumber: '+2222222222',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.unverifiedEmail).toBe('pending@example.com');
        expect(result.data.unverifiedPhoneNumber).toBe('+2222222222');
      }
    });

    test('should transform null values to undefined', () => {
      const result = UnverifiedEmailOrPhonePropertiesSchema.safeParse({
        unverifiedEmail: null,
        unverifiedPhoneNumber: null,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.unverifiedEmail).toBeUndefined();
        expect(result.data.unverifiedPhoneNumber).toBeUndefined();
      }
    });

    test('should reject invalid unverified email format', () => {
      const result = UnverifiedEmailOrPhonePropertiesSchema.safeParse({
        unverifiedEmail: 'also-not-an-email',
      });
      expect(result.success).toBe(false);
    });

    test('should allow empty object', () => {
      const result = UnverifiedEmailOrPhonePropertiesSchema.safeParse({});
      expect(result.success).toBe(true);
    });
  });

  describe('EmailOrPhonePropertiesSchema', () => {
    test('should parse email and phone number', () => {
      const result = EmailOrPhonePropertiesSchema.safeParse({
        email: 'test@example.com',
        phoneNumber: '+1234567890',
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('test@example.com');
        expect(result.data.phoneNumber).toBe('+1234567890');
      }
    });

    test('should transform null values to undefined', () => {
      const result = EmailOrPhonePropertiesSchema.safeParse({
        email: null,
        phoneNumber: null,
      });
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBeUndefined();
        expect(result.data.phoneNumber).toBeUndefined();
      }
    });
  });

  describe('User Payload', () => {
    test('should parse attributes successfully', async () => {
      const item = {
        foo: 'bar',
        id: generateUserId(),
        verifiedPhoneNumber: '+12025551234',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = UserPayloadSchema.safeParse(item);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.metadata).toBeUndefined();
      }
    });

    test('should parse with all verified and unverified email/phone properties', async () => {
      const item = {
        id: generateUserId(),
        verifiedEmail: 'verified@example.com',
        unverifiedEmail: 'pending@example.com',
        verifiedPhoneNumber: '+1234567890',
        unverifiedPhoneNumber: '+0987654321',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = UserPayloadSchema.safeParse(item);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.verifiedEmail).toBe('verified@example.com');
        expect(result.data.unverifiedEmail).toBe('pending@example.com');
        expect(result.data.verifiedPhoneNumber).toBe('+1234567890');
        expect(result.data.unverifiedPhoneNumber).toBe('+0987654321');
      }
    });

    test('should provide email alias for verifiedEmail', async () => {
      const item = {
        id: generateUserId(),
        verifiedEmail: 'verified@example.com',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = UserPayloadSchema.safeParse(item);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('verified@example.com');
        expect(result.data.verifiedEmail).toBe('verified@example.com');
      }
    });

    test('should provide phoneNumber alias for verifiedPhoneNumber', async () => {
      const item = {
        id: generateUserId(),
        verifiedPhoneNumber: '+1234567890',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = UserPayloadSchema.safeParse(item);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.phoneNumber).toBe('+1234567890');
        expect(result.data.verifiedPhoneNumber).toBe('+1234567890');
      }
    });

    test('should serialize nulls to undefined', async () => {
      const payload = {
        id: generateUserId(),
        status: 'unverified',
        givenName: null,
        middleName: null,
        familyName: null,
        honorificPrefix: null,
        honorificSuffix: null,
        verifiedEmail: null,
        unverifiedEmail: null,
        verifiedPhoneNumber: null,
        unverifiedPhoneNumber: null,
        createdAt: '2025-04-02T03:50:40.812Z',
        updatedAt: '2025-04-02T03:50:40.812Z',
      };

      const result = UserPayloadSchema.safeParse(payload);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.verifiedEmail).toBeUndefined();
        expect(result.data.unverifiedEmail).toBeUndefined();
        expect(result.data.verifiedPhoneNumber).toBeUndefined();
        expect(result.data.unverifiedPhoneNumber).toBeUndefined();
        expect(result.data.email).toBeUndefined();
        expect(result.data.phoneNumber).toBeUndefined();
      }
    });
  });

  describe('User Schema', () => {
    test('should parse complete user object', async () => {
      const user = {
        id: generateUserId(),
        givenName: 'John',
        familyName: 'Doe',
        verifiedEmail: 'john@example.com',
        verifiedPhoneNumber: '+1234567890',
        status: UserStatus.ACTIVE,
        lastLogin: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = UserSchema.safeParse(user);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.givenName).toBe('John');
        expect(result.data.verifiedEmail).toBe('john@example.com');
        expect(result.data.verifiedPhoneNumber).toBe('+1234567890');
      }
    });

    test('should provide email alias for verifiedEmail', async () => {
      const user = {
        id: generateUserId(),
        verifiedEmail: 'john@example.com',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = UserSchema.safeParse(user);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('john@example.com');
        expect(result.data.verifiedEmail).toBe('john@example.com');
      }
    });

    test('should provide phoneNumber alias for verifiedPhoneNumber', async () => {
      const user = {
        id: generateUserId(),
        verifiedPhoneNumber: '+1234567890',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = UserSchema.safeParse(user);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.phoneNumber).toBe('+1234567890');
        expect(result.data.verifiedPhoneNumber).toBe('+1234567890');
      }
    });

    test('should have undefined aliases when verified fields are undefined', async () => {
      const user = {
        id: generateUserId(),
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = UserSchema.safeParse(user);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBeUndefined();
        expect(result.data.phoneNumber).toBeUndefined();
        expect(result.data.verifiedEmail).toBeUndefined();
        expect(result.data.verifiedPhoneNumber).toBeUndefined();
      }
    });

    test('should parse user with deletedAt and deactivatedAt', async () => {
      const user = {
        id: generateUserId(),
        status: UserStatus.SUSPENDED,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        deactivatedAt: new Date(),
      };

      const result = UserSchema.safeParse(user);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.deletedAt).toBeInstanceOf(Date);
        expect(result.data.deactivatedAt).toBeInstanceOf(Date);
      }
    });

    test('should include unverified fields alongside aliases', async () => {
      const user = {
        id: generateUserId(),
        verifiedEmail: 'verified@example.com',
        unverifiedEmail: 'pending@example.com',
        verifiedPhoneNumber: '+1111111111',
        unverifiedPhoneNumber: '+2222222222',
        status: UserStatus.ACTIVE,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = UserSchema.safeParse(user);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.email).toBe('verified@example.com');
        expect(result.data.verifiedEmail).toBe('verified@example.com');
        expect(result.data.unverifiedEmail).toBe('pending@example.com');
        expect(result.data.phoneNumber).toBe('+1111111111');
        expect(result.data.verifiedPhoneNumber).toBe('+1111111111');
        expect(result.data.unverifiedPhoneNumber).toBe('+2222222222');
      }
    });
  });

  describe('Insert User Payload', () => {
    test('should parse attributes successfully', async () => {
      const item = {
        foo: 'bar',
        id: generateUserId(),
        familyName: 'Foo',
        verifiedPhoneNumber: true,
      };

      const result = InsertUserPayloadSchema.safeParse(item);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.metadata).toBeUndefined();
        expect(result.data.familyName).toBe(item.familyName);
      }
    });

    test('should parse with all verified and unverified email/phone properties', async () => {
      const item = {
        id: generateUserId(),
        verifiedEmail: true,
        unverifiedEmail: 'pending@example.com',
        verifiedPhoneNumber: true,
        unverifiedPhoneNumber: '+0987654321',
      };

      const result = InsertUserPayloadSchema.safeParse(item);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.verifiedEmail).toBe(true);
        expect(result.data.unverifiedEmail).toBe('pending@example.com');
        expect(result.data.verifiedPhoneNumber).toBe(true);
        expect(result.data.unverifiedPhoneNumber).toBe('+0987654321');
      }
    });

    test('should serialize empty Map to null', async () => {
      const item = {
        foo: 'bar',
        id: generateUserId(),
        verifiedPhoneNumber: true,
        metadata: new Map(),
      };

      const result = InsertUserPayloadSchema.safeParse(item);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.metadata).toBeNull();
      }
    });

    test('should allow optional id and status', async () => {
      const item = {
        verifiedEmail: true,
      };

      const result = InsertUserPayloadSchema.safeParse(item);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBeUndefined();
        expect(result.data.status).toBeUndefined();
      }
    });

    test('should parse with roles association', async () => {
      const item = {
        id: generateUserId(),
        verifiedEmail: true,
        roles: [
          'rol_2NfYOTzVqhCHgWFzUL0WPfRRuhH',
          'rol_2NfYOTzVqhCHgWFzUL0WPfRRuhI',
        ],
      };

      const result = InsertUserPayloadSchema.safeParse(item);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.roles).toEqual([
          'rol_2NfYOTzVqhCHgWFzUL0WPfRRuhH',
          'rol_2NfYOTzVqhCHgWFzUL0WPfRRuhI',
        ]);
      }
    });

    test('should reject when no email or phone number is provided', async () => {
      const item = {
        id: generateUserId(),
        familyName: 'Doe',
      };

      const result = InsertUserPayloadSchema.safeParse(item);

      expect(result.success).toBe(false);
      if (!result.success) {
        const paths = result.error.issues.map((issue) => issue.path[0]);
        expect(paths).toContain('verifiedEmail');
        expect(paths).toContain('verifiedPhoneNumber');
        expect(paths).toContain('unverifiedEmail');
        expect(paths).toContain('unverifiedPhoneNumber');
      }
    });

    test('should accept with only verifiedEmail', async () => {
      const item = {
        verifiedEmail: true,
      };

      const result = InsertUserPayloadSchema.safeParse(item);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.verifiedEmail).toBe(true);
      }
    });

    test('should accept with only verifiedPhoneNumber', async () => {
      const item = {
        verifiedPhoneNumber: true,
      };

      const result = InsertUserPayloadSchema.safeParse(item);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.verifiedPhoneNumber).toBe(true);
      }
    });

    test('should succeed with only unverifiedEmail', async () => {
      const item = {
        unverifiedEmail: 'test@example.com',
        verifiedEmail: true,
        unverifiedPhoneNumber: null,
      };

      const result = InsertUserPayloadSchema.safeParse(item);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.unverifiedEmail).toBe('test@example.com');
        expect(result.data.unverifiedPhoneNumber).toBeNull();
        expect(result.data.verifiedEmail).toBe(true);
        expect(result.data.verifiedPhoneNumber).toBeUndefined();
      }
    });

    test('should succeed with only unverifiedPhoneNumber', async () => {
      const item = {
        unverifiedEmail: null,
        unverifiedPhoneNumber: '+12025551234',
        verifiedPhoneNumber: true,
      };

      const result = InsertUserPayloadSchema.safeParse(item);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.unverifiedPhoneNumber).toBe('+12025551234');
        expect(result.data.unverifiedEmail).toBeNull();
        expect(result.data.verifiedEmail).toBeUndefined();
        expect(result.data.verifiedPhoneNumber).toBe(true);
      }
    });
  });

  describe('Update User Payload', () => {
    test('should parse suspended flag', async () => {
      const result = UpdateUserPayloadSchema.safeParse({
        suspended: true,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.suspended).toBe(true);
      }
    });

    test('should parse name updates', async () => {
      const result = UpdateUserPayloadSchema.safeParse({
        givenName: 'Jane',
        familyName: null,
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.givenName).toBe('Jane');
        expect(result.data.familyName).toBeNull();
      }
    });

    test('should parse verified and unverified email/phone updates', async () => {
      const result = UpdateUserPayloadSchema.safeParse({
        verifiedEmail: 'newemail@example.com',
        unverifiedEmail: 'pending@example.com',
        verifiedPhoneNumber: '+9999999999',
        unverifiedPhoneNumber: '+8888888888',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.verifiedEmail).toBe('newemail@example.com');
        expect(result.data.unverifiedEmail).toBe('pending@example.com');
        expect(result.data.verifiedPhoneNumber).toBe('+9999999999');
        expect(result.data.unverifiedPhoneNumber).toBe('+8888888888');
      }
    });

    test('should parse metadata updates', async () => {
      const result = UpdateUserPayloadSchema.safeParse({
        metadata: { key: 'value' },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.metadata).toEqual({ key: 'value' });
      }
    });

    test('should allow empty object', async () => {
      const result = UpdateUserPayloadSchema.safeParse({});

      expect(result.success).toBe(true);
    });
  });

  describe('UserAssociationReferenceSchema', () => {
    test('should parse valid association reference', () => {
      const result = UserAssociationReferenceSchema.safeParse({
        id: generateUserId(),
        givenName: 'John',
        familyName: 'Doe',
        email: 'john@example.com',
        phoneNumber: '+1234567890',
        model: 'User',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.model).toBe('User');
        expect(result.data.status).toBe('unverified');
      }
    });

    test('should default status to unverified', () => {
      const result = UserAssociationReferenceSchema.safeParse({
        id: generateUserId(),
        model: 'User',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('unverified');
      }
    });

    test('should allow custom status', () => {
      const result = UserAssociationReferenceSchema.safeParse({
        id: generateUserId(),
        status: 'active',
        model: 'User',
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.status).toBe('active');
      }
    });

    test('should reject invalid model literal', () => {
      const result = UserAssociationReferenceSchema.safeParse({
        id: generateUserId(),
        model: 'Organization',
      });

      expect(result.success).toBe(false);
    });
  });
});
