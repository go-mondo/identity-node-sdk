import { type } from 'arktype';
import { describe, expect, test } from 'vitest';
import {
  type Registration,
  type RegistrationPayload,
  RegistrationPayloadSchema,
  RegistrationSchema,
  UpsertRegistrationPayloadSchema,
} from './schema.js';

describe('App Registration - Schema', () => {
  describe('RegistrationSchema', () => {
    test('should accept complete registration object', () => {
      const registration = {
        allowSelfRegistration: true,
        updatedAt: new Date(),
        deletedAt: new Date(),
        deactivatedAt: new Date(),
        metadata: {
          approval_required: false,
          email_verification: true,
          default_role: 'user',
        },
      };

      const result = RegistrationSchema(registration);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept minimal registration object', () => {
      const registration = {
        metadata: {},
      };

      const result = RegistrationSchema(registration);
      expect(result).not.toBeInstanceOf(type.errors);
      // Should have default allowSelfRegistration value
      expect((result as Registration).allowSelfRegistration).toBe(false);
    });

    test('should accept registration with allowSelfRegistration false', () => {
      const registration = {
        allowSelfRegistration: false,
        metadata: {
          registration_flow: 'invite_only',
          admin_approval: true,
        },
      };

      const result = RegistrationSchema(registration);
      expect(result).not.toBeInstanceOf(type.errors);
      expect((result as Registration).allowSelfRegistration).toBe(false);
    });

    test('should accept registration with allowSelfRegistration true', () => {
      const registration = {
        allowSelfRegistration: true,
        updatedAt: new Date(),
        metadata: {
          registration_flow: 'open',
          email_domains: ['example.com', 'company.org'],
          require_email_verification: true,
        },
      };

      const result = RegistrationSchema(registration);
      expect(result).not.toBeInstanceOf(type.errors);
      expect((result as Registration).allowSelfRegistration).toBe(true);
    });

    test('should accept registration with optional dates', () => {
      const registration = {
        allowSelfRegistration: true,
        updatedAt: new Date(),
        metadata: {
          last_config_change: new Date().toISOString(),
          configured_by: 'admin@example.com',
        },
      };

      const result = RegistrationSchema(registration);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept registration with complex metadata', () => {
      const registration = {
        allowSelfRegistration: true,
        updatedAt: new Date(),
        deletedAt: new Date(),
        metadata: {
          settings: {
            email_verification_required: true,
            phone_verification_required: false,
            captcha_required: true,
            password_policy: {
              min_length: 8,
              require_uppercase: true,
              require_lowercase: true,
              require_numbers: true,
              require_symbols: false,
            },
          },
          restrictions: {
            allowed_domains: ['company.com', 'partner.org'],
            blocked_domains: ['tempmail.com', 'guerrillamail.info'],
            max_registrations_per_day: 100,
            rate_limit_per_ip: 5,
          },
          workflow: {
            approval_workflow: false,
            auto_assign_role: 'member',
            welcome_email: true,
            onboarding_flow: 'standard',
          },
        },
      };

      const result = RegistrationSchema(registration);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should reject invalid allowSelfRegistration type', () => {
      const registration = {
        allowSelfRegistration: 'yes', // should be boolean
        metadata: {},
      };

      const result = RegistrationSchema(registration);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject invalid date types', () => {
      const registration = {
        allowSelfRegistration: true,
        updatedAt: 'invalid-date',
        metadata: {},
      };

      const result = RegistrationSchema(registration);
      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('RegistrationPayloadSchema', () => {
    test('should accept complete payload', () => {
      const payload = {
        allowSelfRegistration: true,
        updatedAt: new Date().toISOString(),
        deletedAt: new Date().toISOString(),
        deactivatedAt: new Date().toISOString(),
        metadata: {
          configuration: 'open_registration',
          updated_by: 'admin@example.com',
        },
      };

      const result = RegistrationPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should accept minimal payload', () => {
      const payload = {
        metadata: {},
      };

      const result = RegistrationPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect((result as RegistrationPayload).allowSelfRegistration).toBe(false);
    });

    test('should accept payload with allowSelfRegistration', () => {
      const payload = {
        allowSelfRegistration: true,
        metadata: {
          feature_enabled: true,
          enabled_at: new Date().toISOString(),
        },
      };

      const result = RegistrationPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept payload with optional dates', () => {
      const payload = {
        allowSelfRegistration: false,
        updatedAt: new Date().toISOString(),
        metadata: {
          disabled_reason: 'maintenance',
          re_enable_at: new Date().toISOString(),
        },
      };

      const result = RegistrationPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept payload with comprehensive registration settings', () => {
      const payload = {
        allowSelfRegistration: true,
        updatedAt: new Date().toISOString(),
        metadata: {
          email_format: 'strict',
          name_min_length: 2,
          phone_format: 'international',
        },
      };

      const result = RegistrationPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should reject invalid date format', () => {
      const payload = {
        allowSelfRegistration: true,
        updatedAt: 'invalid-date',
        metadata: {},
      };

      const result = RegistrationPayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject invalid allowSelfRegistration type', () => {
      const payload = {
        allowSelfRegistration: 'true', // should be boolean
        metadata: {},
      };

      const result = RegistrationPayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('UpsertRegistrationPayloadSchema', () => {
    test('should accept upsert with allowSelfRegistration', () => {
      const payload = {
        allowSelfRegistration: true,
        metadata: {
          operation: 'enable_self_registration',
          reason: 'open_beta_launch',
        },
      };

      const result = UpsertRegistrationPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should accept upsert without allowSelfRegistration', () => {
      const payload = {
        metadata: {
          operation: 'enable_self_registration',
          reason: 'open_beta_launch',
        },
      };

      const result = UpsertRegistrationPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept upsert with undefined allowSelfRegistration', () => {
      const payload = {
        allowSelfRegistration: undefined,
        metadata: {
          partial_update: true,
        },
      };

      const result = UpsertRegistrationPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept empty metadata', () => {
      const payload = {
        allowSelfRegistration: false,
        metadata: {},
      };

      const result = UpsertRegistrationPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept comprehensive upsert payload', () => {
      const payload = {
        allowSelfRegistration: true,
        metadata: {
          updated_by: 'admin@example.com',
          change_reason: 'platform_upgrade',
        },
      };

      const result = UpsertRegistrationPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should reject invalid allowSelfRegistration type', () => {
      const payload = {
        allowSelfRegistration: 'maybe', // should be boolean or undefined
        metadata: {},
      };

      const result = UpsertRegistrationPayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
    });
  });
});
