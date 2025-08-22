import { describe, expect, test } from 'vitest';
import {
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

      const result = RegistrationSchema.safeParse(registration);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
    });

    test('should accept minimal registration object', () => {
      const registration = {
        metadata: {},
      };

      const result = RegistrationSchema.safeParse(registration);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        // Should have default allowSelfRegistration value
        expect(result.data.allowSelfRegistration).toBe(false);
      }
    });

    test('should accept registration with allowSelfRegistration false', () => {
      const registration = {
        allowSelfRegistration: false,
        metadata: {
          registration_flow: 'invite_only',
          admin_approval: true,
        },
      };

      const result = RegistrationSchema.safeParse(registration);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.allowSelfRegistration).toBe(false);
      }
    });

    test('should accept registration with allowSelfRegistration true', () => {
      const registration = {
        allowSelfRegistration: true,
        updatedAt: new Date(),
        metadata: {
          registration_flow: 'open',
          email_domains: 'example.com',
          require_email_verification: true,
        },
      };

      const result = RegistrationSchema.safeParse(registration);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.allowSelfRegistration).toBe(true);
      }
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

      const result = RegistrationSchema.safeParse(registration);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
    });
  });

  describe('RegistrationPayloadSchema', () => {
    test('should accept minimal payload', () => {
      const payload = {
        metadata: {},
      };

      const result = RegistrationPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
      expect(result.data?.allowSelfRegistration).toBe(false);
    });

    test('should accept payload with allowSelfRegistration', () => {
      const payload = {
        allowSelfRegistration: false,
        metadata: {
          admin_approval_required: true,
        },
      };

      const result = RegistrationPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(payload);
      }
    });

    test('should accept payload with optional dates', () => {
      const payload = {
        allowSelfRegistration: true,
        updatedAt: new Date().toISOString(),
        metadata: {
          configured_at: new Date().toISOString(),
        },
      };

      const result = RegistrationPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
    });
  });

  describe('UpsertRegistrationPayloadSchema', () => {
    test('should accept upsert with allowSelfRegistration', () => {
      const payload = {
        allowSelfRegistration: true,
        metadata: {
          updated_by: 'admin@example.com',
        },
      };

      const result = UpsertRegistrationPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
    });

    test('should accept upsert without allowSelfRegistration', () => {
      const payload = {
        metadata: {
          config_version: '2.1',
        },
      };

      const result = UpsertRegistrationPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
    });

    test('should accept upsert with undefined allowSelfRegistration', () => {
      const payload = {
        allowSelfRegistration: undefined,
        metadata: {},
      };

      const result = UpsertRegistrationPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
    });

    test('should accept empty metadata', () => {
      const payload = {
        metadata: {},
      };

      const result = UpsertRegistrationPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
    });

    test('should accept comprehensive upsert payload', () => {
      const payload = {
        allowSelfRegistration: false,
        metadata: {
          registration_flow: 'invite_only',
          email_domains: 'corp.example.com',
          admin_approval: true,
          require_email_verification: true,
          welcome_email_enabled: false,
          custom_registration_fields: 'department',
        },
      };

      const result = UpsertRegistrationPayloadSchema.safeParse(payload);
      expect(result.success).toBe(true);
    });

    test('should reject invalid allowSelfRegistration type', () => {
      const payload = {
        allowSelfRegistration: 'invalid', // should be boolean
        metadata: {},
      };

      const result = UpsertRegistrationPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });
});
