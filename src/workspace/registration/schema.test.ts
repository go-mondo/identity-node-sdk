import { describe, expect, test } from 'vitest';
import { IdentityIdentifier } from '../../identity/schema.js';
import {
  RegistrationPayloadSchema,
  RegistrationSchema,
  UpsertRegistrationPayloadSchema,
} from './schema.js';

describe('Workspace Registration - Schema', () => {
  describe('RegistrationSchema', () => {
    test('should accept complete registration settings', () => {
      const updatedAt = new Date();
      const registration = {
        allowSelfRegistration: true,
        identifiers: [
          { type: IdentityIdentifier.EMAIL },
          { type: IdentityIdentifier.PHONE_NUMBER },
        ],
        updatedAt,
        deletedAt: new Date(),
        deactivatedAt: new Date(),
        metadata: {
          approvalRequired: false,
        },
      };

      const result = RegistrationSchema.safeParse(registration);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.allowSelfRegistration).toBe(true);
        expect(result.data.identifiers).toEqual(registration.identifiers);
        expect(result.data.metadata).toBeInstanceOf(Map);
        expect(result.data.metadata.get('approvalRequired')).toBe(false);
      }
    });

    test('should apply default registration settings', () => {
      const result = RegistrationSchema.safeParse({});

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.allowSelfRegistration).toBe(false);
        expect(result.data.identifiers).toEqual([
          { type: IdentityIdentifier.EMAIL },
        ]);
      }
    });

    test('should reject invalid identifier types', () => {
      const result = RegistrationSchema.safeParse({
        identifiers: [{ type: 'username' }],
      });

      expect(result.success).toBe(false);
    });
  });

  describe('RegistrationPayloadSchema', () => {
    test('should serialize dates and metadata for payloads', () => {
      const updatedAt = new Date('2026-03-01T00:00:00.000Z');
      const result = RegistrationPayloadSchema.safeParse({
        allowSelfRegistration: true,
        identifiers: [{ type: IdentityIdentifier.PHONE_NUMBER }],
        updatedAt,
        metadata: new Map<string, string>([['flow', 'open']]),
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.updatedAt).toBe(updatedAt.toISOString());
        expect(result.data.identifiers).toEqual([
          { type: IdentityIdentifier.PHONE_NUMBER },
        ]);
        expect(result.data.metadata).toEqual({ flow: 'open' });
      }
    });
  });

  describe('UpsertRegistrationPayloadSchema', () => {
    test('should accept partial registration updates', () => {
      const result = UpsertRegistrationPayloadSchema.safeParse({
        identifiers: [
          { type: IdentityIdentifier.EMAIL },
          { type: IdentityIdentifier.PHONE_NUMBER },
        ],
        metadata: {
          updatedBy: 'admin',
        },
      });

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.allowSelfRegistration).toBeUndefined();
        expect(result.data.metadata).toEqual({ updatedBy: 'admin' });
      }
    });

    test('should normalize empty metadata to null', () => {
      const result = UpsertRegistrationPayloadSchema.safeParse({
        metadata: {},
      });

      expect(result.success).toBe(true);
      expect(result.data?.metadata).toBeNull();
    });
  });
});
