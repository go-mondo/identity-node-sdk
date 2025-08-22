import { type } from 'arktype';
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

      const result = EmailStrategySchema(strategy);
      expect(result).not.toBeInstanceOf(type.errors);
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

      const result = EmailStrategySchema(strategy);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject missing required fields', () => {
      const strategy = {
        type: 'email',
        // missing id, enabled, dates, metadata
      };

      const result = EmailStrategySchema(strategy);
      expect(result).toBeInstanceOf(type.errors);
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

      const result = EmailStrategyPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
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

      const result = EmailStrategyPayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
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

      const result = InsertEmailStrategyPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept minimal insert payload', () => {
      const payload = {
        type: 'email',
        label: 'Test',
      };

      const result = InsertEmailStrategyPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should reject missing type', () => {
      const payload = {
        status: 'enabled',
      };

      const result = InsertEmailStrategyPayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject invalid type', () => {
      const payload = {
        type: 'password',
      };

      const result = InsertEmailStrategyPayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('UpdateEmailStrategyPayloadSchema', () => {
    test('should accept update with type and enabled', () => {
      const payload = {
        type: 'email',
        enabled: false,
        metadata: { updated: true },
      };

      const result = UpdateEmailStrategyPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should accept minimal update', () => {
      const payload = {
        type: 'email',
      };

      const result = UpdateEmailStrategyPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should reject invalid type', () => {
      const payload = {
        type: 'totp',
      };

      const result = UpdateEmailStrategyPayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('VerifyEmailSchema', () => {
    test('should accept verification with email and code', () => {
      const verification = {
        email: 'user@example.com',
        code: '123456',
      };

      const result = VerifyEmailSchema(verification);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(verification);
    });

    test('should accept verification with only code', () => {
      const verification = {
        code: 'ABC123',
      };

      const result = VerifyEmailSchema(verification);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(verification);
    });

    test('should reject missing code', () => {
      const verification = {
        email: 'user@example.com',
      };

      const result = VerifyEmailSchema(verification);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject invalid email format', () => {
      const verification = {
        email: 'invalid-email',
        code: '123456',
      };

      const result = VerifyEmailSchema(verification);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject non-string code', () => {
      const verification = {
        email: 'user@example.com',
        code: 123456,
      };

      const result = VerifyEmailSchema(verification);
      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('SendEmailVerificationCodeSchema', () => {
    test('should accept valid email', () => {
      const request = {
        email: 'test@example.com',
      };

      const result = SendEmailVerificationCodeSchema(request);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(request);
    });

    test('should accept empty request', () => {
      const request = {};

      const result = SendEmailVerificationCodeSchema(request);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(request);
    });

    test('should reject invalid email format', () => {
      const request = {
        email: 'not-an-email',
      };

      const result = SendEmailVerificationCodeSchema(request);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject non-string email', () => {
      const request = {
        email: 123,
      };

      const result = SendEmailVerificationCodeSchema(request);
      expect(result).toBeInstanceOf(type.errors);
    });
  });
});
