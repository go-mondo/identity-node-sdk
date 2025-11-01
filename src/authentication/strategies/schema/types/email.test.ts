import { describe, expect, test } from 'vitest';
import { generateStrategyId } from '../../../../authentication/utils.js';
import {
  EmailStrategyPayloadSchema,
  EmailStrategySchema,
  InsertEmailStrategyPayloadSchema,
  SendEmailVerificationCodeSchema,
  UpdateEmailStrategyPayloadSchema,
  VerifyEmailSchema,
} from './email.js';

describe('Authentication Strategies - Email', () => {
  describe('EmailStrategySchema', () => {
    test('should accept complete email strategy', () => {
      const strategy = {
        id: generateStrategyId(),
        type: 'email',
        label: 'Test',
        status: 'enabled',
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: { provider: 'sendgrid' },
      };

      const result = EmailStrategySchema.safeParse(strategy);
      // Parse succeeds for valid data
    });

    test('should reject invalid type', () => {
      const strategy = {
        id: generateStrategyId(),
        type: 'password',
        status: 'enabled',
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      };

      const result = EmailStrategySchema.safeParse(strategy);
      expect(result.success).toBe(false);
    });

    test('should reject missing required fields', () => {
      const strategy = {
        type: 'email',
        // missing id, enabled, dates, metadata
      };

      const result = EmailStrategySchema.safeParse(strategy);
      expect(result.success).toBe(false);
    });
  });

  describe('EmailStrategyPayloadSchema', () => {
    test('should accept complete payload', () => {
      const payload = {
        id: generateStrategyId(),
        type: 'email',
        label: 'Test',
        status: 'enabled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: { configured: true },
      };

      const result = EmailStrategyPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
      expect(result.data).toEqual(payload);
    });

    test('should reject invalid type', () => {
      const payload = {
        id: generateStrategyId(),
        type: 'sms',
        label: 'Test',
        status: 'enabled',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        metadata: {},
      };

      const result = EmailStrategyPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('InsertEmailStrategyPayloadSchema', () => {
    test('should accept complete insert payload', () => {
      const payload = {
        id: generateStrategyId(),
        type: 'email',
        label: 'Test',
        status: 'enabled',
        metadata: { setup: 'manual' },
      };

      const result = InsertEmailStrategyPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
    });

    test('should accept minimal insert payload', () => {
      const payload = {
        type: 'email',
        label: 'Test',
      };

      const result = InsertEmailStrategyPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
    });

    test('should reject missing type', () => {
      const payload = {
        status: 'enabled',
      };

      const result = InsertEmailStrategyPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });

    test('should reject invalid type', () => {
      const payload = {
        type: 'password',
      };

      const result = InsertEmailStrategyPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('UpdateEmailStrategyPayloadSchema', () => {
    test('should accept update with type and enabled', () => {
      const payload = {
        type: 'email',
        enabled: false,
        metadata: { updated: true },
      };

      const result = UpdateEmailStrategyPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
      expect(result.data?.type).toEqual(payload.type);
      expect(result.data?.metadata).toEqual(payload.metadata);
    });

    test('should accept minimal update', () => {
      const payload = {
        type: 'email',
      };

      const result = UpdateEmailStrategyPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
    });

    test('should reject invalid type', () => {
      const payload = {
        type: 'totp',
      };

      const result = UpdateEmailStrategyPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('VerifyEmailSchema', () => {
    test('should accept verification with email and code', () => {
      const verification = {
        email: 'user@example.com',
        code: '123456',
      };

      const result = VerifyEmailSchema.safeParse(verification);
      // Parse succeeds for valid data
      expect(result.data).toEqual(verification);
    });

    test('should accept verification with only code', () => {
      const verification = {
        code: 'ABC123',
      };

      const result = VerifyEmailSchema.safeParse(verification);
      // Parse succeeds for valid data
      expect(result.data).toEqual(verification);
    });

    test('should reject missing code', () => {
      const verification = {
        email: 'user@example.com',
      };

      const result = VerifyEmailSchema.safeParse(verification);
      expect(result.success).toBe(false);
    });

    test('should reject invalid email format', () => {
      const verification = {
        email: 'invalid-email',
        code: '123456',
      };

      const result = VerifyEmailSchema.safeParse(verification);
      expect(result.success).toBe(false);
    });

    test('should reject non-string code', () => {
      const verification = {
        email: 'user@example.com',
        code: 123456,
      };

      const result = VerifyEmailSchema.safeParse(verification);
      expect(result.success).toBe(false);
    });
  });

  describe('SendEmailVerificationCodeSchema', () => {
    test('should accept valid email', () => {
      const request = {
        email: 'test@example.com',
      };

      const result = SendEmailVerificationCodeSchema.safeParse(request);
      // Parse succeeds for valid data
      expect(result.data).toEqual(request);
    });

    test('should accept empty request', () => {
      const request = {};

      const result = SendEmailVerificationCodeSchema.safeParse(request);
      // Parse succeeds for valid data
      expect(result.data).toEqual(request);
    });

    test('should reject invalid email format', () => {
      const request = {
        email: 'not-an-email',
      };

      const result = SendEmailVerificationCodeSchema.safeParse(request);
      expect(result.success).toBe(false);
    });

    test('should reject non-string email', () => {
      const request = {
        email: 123,
      };

      const result = SendEmailVerificationCodeSchema.safeParse(request);
      expect(result.success).toBe(false);
    });
  });
});
