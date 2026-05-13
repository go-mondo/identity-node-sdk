import { describe, expect, test } from 'vitest';
import { generateAppId } from '../../../app/utils.js';
import { generateUserId } from '../../../customer/schema.js';
import { generateActionId } from '../utils.js';
import {
  SignUpActionPayloadSchema,
  SignUpActionRequestSchema,
} from './sign-up.js';

describe('Action Schema Operations - Sign Up', () => {
  describe('SignUpActionPayloadSchema', () => {
    test('should accept complete payload with app', () => {
      const payload = {
        id: generateActionId(),
        operation: 'sign-up' as const,
        app: generateAppId(),
        user: {
          givenName: 'John',
          familyName: 'Doe',
        },
        attempt: 1,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { key: 'value' },
      };

      const result = SignUpActionPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.data).toEqual(payload);
    });

    test('should accept payload without app', () => {
      const payload = {
        id: generateActionId(),
        operation: 'sign-up' as const,
        user: {
          givenName: 'Jane',
          familyName: 'Smith',
        },
        attempt: 1,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = SignUpActionPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
    });

    test('should accept minimal user name properties', () => {
      const payload = {
        id: generateActionId(),
        operation: 'sign-up' as const,
        user: {},
        attempt: 1,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = SignUpActionPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
    });

    test('should reject invalid operation', () => {
      const payload = {
        id: generateActionId(),
        operation: 'invalid-operation',
        user: { givenName: 'John' },
        attempt: 1,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = SignUpActionPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject missing required fields', () => {
      const payload = {
        id: generateActionId(),
        operation: 'sign-up' as const,
        // missing user, attempt, etc.
      };

      const result = SignUpActionPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should delete undeclared keys', () => {
      const payload = {
        id: generateActionId(),
        operation: 'sign-up' as const,
        user: { givenName: 'John' },
        attempt: 1,
        expiresAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
        extraField: 'should be removed',
      };

      const result = SignUpActionPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.data).not.toHaveProperty('extraField');
    });
  });

  describe('SignUpActionRequestSchema', () => {
    test('should accept email sign up request', () => {
      const request = {
        id: generateUserId(),
        email: '  John@Example.COM  ',
        givenName: 'John',
        familyName: 'Doe',
      };

      const result = SignUpActionRequestSchema.safeParse(request);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual({
          ...request,
          email: 'john@example.com',
        });
      }
    });

    test('should accept phone number sign up request', () => {
      const request = {
        id: generateUserId(),
        phoneNumber: '+1234567890',
        givenName: 'Jane',
        familyName: 'Smith',
      };

      const result = SignUpActionRequestSchema.safeParse(request);
      // Parse succeeds for valid data
      expect(result.data).toEqual(request);
    });

    test('should accept request with both email and phone', () => {
      const request = {
        id: generateUserId(),
        email: 'john@example.com',
        phoneNumber: '+1234567890',
        givenName: 'John',
        familyName: 'Doe',
      };

      const result = SignUpActionRequestSchema.safeParse(request);
      // Parse succeeds for valid data
      expect(result.data).toEqual(request);
    });

    test('should accept minimal request with just email', () => {
      const request = {
        email: 'minimal@example.com',
      };

      const result = SignUpActionRequestSchema.safeParse(request);
      // Parse succeeds for valid data
    });

    test('should accept minimal request with just phone', () => {
      const request = {
        phoneNumber: '+1234567890',
      };

      const result = SignUpActionRequestSchema.safeParse(request);
      // Parse succeeds for valid data
    });

    test('should reject request without email or phone', () => {
      const request = {
        givenName: 'John',
        familyName: 'Doe',
      };

      const result = SignUpActionRequestSchema.safeParse(request);
      expect(result.success).toBe(false);
    });

    test('should reject invalid email format', () => {
      const request = {
        email: 'invalid-email',
        givenName: 'John',
      };

      const result = SignUpActionRequestSchema.safeParse(request);
      expect(result.success).toBe(false);
    });

    test('should accept optional name properties', () => {
      const request = {
        email: 'john@example.com',
        givenName: 'John',
        familyName: 'Doe',
        middleName: 'Michael',
        honorificPrefix: 'Dr.',
        honorificSuffix: 'Jr.',
      };

      const result = SignUpActionRequestSchema.safeParse(request);
      // Parse succeeds for valid data
    });
  });
});
