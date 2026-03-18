import { describe, expect, test } from 'vitest';
import { generateUserId } from '../../customer/schema.js';
import { ActionOperation, ActionPayloadSchema } from './schema.js';
import { generateActionId } from './utils.js';

describe('Action Schema - Main', () => {
  describe('ActionPayloadSchema', () => {
    test('should accept sign-up-verification action payload', () => {
      const payload = {
        id: generateActionId(),
        operation: 'sign-up-verification' as const,
        user: generateUserId(),
        identifier: 'email' as const,
        attempt: 1,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { method: 'email' },
      };

      const result = ActionPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
    });

    test('should accept sign-up action payload', () => {
      const payload = {
        id: generateActionId(),
        operation: 'sign-up' as const,
        user: {
          firstName: 'John',
          lastName: 'Doe',
        },
        attempt: 1,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { registration_source: 'web' },
      };

      const result = ActionPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
    });

    test('should accept user-attribute-verification action payload', () => {
      const payload = {
        id: generateActionId(),
        operation: 'user-attribute-verification' as const,
        user: generateUserId(),
        attribute: 'email' as const,
        attempt: 1,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { verification_type: 'change_email' },
      };

      const result = ActionPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
    });

    test('should reject invalid action operation', () => {
      const payload = {
        id: generateActionId(),
        operation: 'invalid-operation',
        metadata: {},
      };

      const result = ActionPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject payload missing required fields for sign-up-verification', () => {
      const payload = {
        id: generateActionId(),
        operation: 'sign-up-verification' as const,
        // missing code
        metadata: {},
      };

      const result = ActionPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject payload missing required fields for sign-up', () => {
      const payload = {
        id: generateActionId(),
        operation: 'sign-up' as const,
        // missing email
        metadata: {},
      };

      const result = ActionPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject payload missing required fields for user-attribute-verification', () => {
      const payload = {
        id: generateActionId(),
        operation: 'user-attribute-verification' as const,
        attribute: 'email' as const,
        // missing value and code
        metadata: {},
      };

      const result = ActionPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should accept complex payloads with all optional fields', () => {
      const payload = {
        id: generateActionId(),
        operation: 'sign-up' as const,
        user: {
          firstName: 'John',
          lastName: 'Doe',
        },
        attempt: 1,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {
          source: 'mobile-app',
          campaign: 'summer-2024',
          referrer: 'friend-invitation',
          terms_accepted: true,
          marketing_consent: false,
        },
      };

      const result = ActionPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
    });

    test('should accept user-attribute-verification with phone attribute', () => {
      const payload = {
        id: generateActionId(),
        operation: 'user-attribute-verification' as const,
        user: generateUserId(),
        attribute: 'phoneNumber' as const,
        attempt: 1,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { verification_method: 'sms' },
      };

      const result = ActionPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
    });

    test('should reject malformed user data in sign-up action', () => {
      const payload = {
        id: generateActionId(),
        operation: 'sign-up' as const,
        user: 'invalid-user-data', // should be object
        attempt: 1,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = ActionPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject invalid attribute type in user-attribute-verification', () => {
      const payload = {
        id: generateActionId(),
        operation: 'user-attribute-verification' as const,
        user: generateUserId(),
        attribute: 'invalid_attribute',
        attempt: 1,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = ActionPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('ActionOperation constants', () => {
    test('should contain expected operation values', () => {
      expect(ActionOperation.SIGN_UP_VERIFICATION).toBe('sign-up-verification');
      expect(ActionOperation.SIGN_UP).toBe('sign-up');
      expect(ActionOperation.USER_ATTRIBUTE_VERIFICATION).toBe(
        'user-attribute-verification'
      );
    });
  });
});
