import { describe, expect, test } from 'vitest';
import { generateTenantId } from '../utils.js';
import {
  InsertTenantPayloadSchema,
  TenantIdSchema,
  TenantPayloadSchema,
  TenantSchema,
  UpdateTenantPayloadSchema,
} from './schema.js';

describe('Workspace - Tenant', () => {
  describe('TenantIdSchema', () => {
    test('should parse valid tenant ID', () => {
      const id = generateTenantId();
      const result = TenantIdSchema.safeParse(id);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toBe(id);
      }
    });

    test('should reject invalid prefix', () => {
      const invalidId = 'org_2SVDTvbPaWdRG0CdE9EsVZBjxur';
      const result = TenantIdSchema.safeParse(invalidId);

      expect(result.success).toBe(false);
    });

    test('should reject invalid format', () => {
      const invalidId = 'tnt-invalid-format';
      const result = TenantIdSchema.safeParse(invalidId);

      expect(result.success).toBe(false);
    });
  });

  describe('TenantSchema', () => {
    test('should parse valid tenant with all fields', () => {
      const tenant = {
        id: generateTenantId(),
        handle: 'test-tenant',
        name: 'Test Tenant',
        supportEmail: 'support@test.com',
        authHost: 'https://auth.test.com',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
        membership: {
          id: 'mbr_test',
          role: 'owner',
        },
      };

      const result = TenantSchema.safeParse(tenant);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(tenant.id);
        expect(result.data.handle).toBe(tenant.handle);
        expect(result.data.name).toBe(tenant.name);
        expect(result.data.supportEmail).toBe(tenant.supportEmail);
        expect(result.data.authHost).toBe(tenant.authHost);
      }
    });

    test('should parse valid tenant with minimal fields', () => {
      const tenant = {
        id: generateTenantId(),
        handle: 'minimal-tenant',
        name: 'Minimal',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = TenantSchema.safeParse(tenant);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(tenant.id);
        expect(result.data.handle).toBe(tenant.handle);
      }
    });

    test('should reject invalid email', () => {
      const tenant = {
        id: generateTenantId(),
        handle: 'test-tenant',
        name: 'Test',
        supportEmail: 'not-an-email',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = TenantSchema.safeParse(tenant);

      expect(result.success).toBe(false);
    });

    test('should reject invalid authHost URL', () => {
      const tenant = {
        id: generateTenantId(),
        handle: 'test-tenant',
        name: 'Test',
        authHost: 'not-a-url',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = TenantSchema.safeParse(tenant);

      expect(result.success).toBe(false);
    });
  });

  describe('TenantPayloadSchema', () => {
    test('should parse valid tenant payload', () => {
      const payload = {
        id: generateTenantId(),
        handle: 'test-tenant',
        name: 'Test Tenant',
        supportEmail: 'support@test.com',
        authHost: 'https://auth.test.com',
        status: 'active',
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      const result = TenantPayloadSchema.safeParse(payload);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(payload.id);
        expect(result.data.handle).toBe(payload.handle);
        expect(result.data.supportEmail).toBe(payload.supportEmail);
      }
    });
  });

  describe('InsertTenantPayloadSchema', () => {
    test('should generate default ID and handle when not provided', () => {
      const payload = {
        name: 'New Tenant',
      };

      const result = InsertTenantPayloadSchema.safeParse(payload);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toMatch(/^tnt_[A-Za-z0-9]+$/);
        expect(result.data.handle).toMatch(/^[a-f0-9]{12}$/);
        expect(result.data.name).toBe(payload.name);
      }
    });

    test('should use provided ID and handle', () => {
      const customId = generateTenantId();
      const customHandle = 'custom-handle';
      const payload = {
        id: customId,
        handle: customHandle,
        name: 'Custom Tenant',
      };

      const result = InsertTenantPayloadSchema.safeParse(payload);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.id).toBe(customId);
        expect(result.data.handle).toBe(customHandle);
      }
    });

    test('should parse with optional supportEmail', () => {
      const payload = {
        name: 'Test Tenant',
        supportEmail: 'support@example.com',
      };

      const result = InsertTenantPayloadSchema.safeParse(payload);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.supportEmail).toBe(payload.supportEmail);
      }
    });

    test('should reject invalid supportEmail', () => {
      const payload = {
        name: 'Test Tenant',
        supportEmail: 'invalid-email',
      };

      const result = InsertTenantPayloadSchema.safeParse(payload);

      expect(result.success).toBe(false);
    });

    test('should generate unique IDs for multiple inserts', () => {
      const payload1 = { name: 'Tenant 1' };
      const payload2 = { name: 'Tenant 2' };

      const result1 = InsertTenantPayloadSchema.safeParse(payload1);
      const result2 = InsertTenantPayloadSchema.safeParse(payload2);

      expect(result1.success).toBe(true);
      expect(result2.success).toBe(true);

      if (result1.success && result2.success) {
        expect(result1.data.id).not.toBe(result2.data.id);
        expect(result1.data.handle).not.toBe(result2.data.handle);
      }
    });
  });

  describe('UpdateTenantPayloadSchema', () => {
    test('should parse update with all optional fields', () => {
      const payload = {
        name: 'Updated Name',
        handle: 'updated-handle',
        supportEmail: 'updated@example.com',
      };

      const result = UpdateTenantPayloadSchema.safeParse(payload);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe(payload.name);
        expect(result.data.handle).toBe(payload.handle);
        expect(result.data.supportEmail).toBe(payload.supportEmail);
      }
    });

    test('should parse update with only name', () => {
      const payload = {
        name: 'Only Name',
      };

      const result = UpdateTenantPayloadSchema.safeParse(payload);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.name).toBe(payload.name);
      }
    });

    test('should parse update with only handle', () => {
      const payload = {
        handle: 'new-handle',
      };

      const result = UpdateTenantPayloadSchema.safeParse(payload);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.handle).toBe(payload.handle);
      }
    });

    test('should parse update with only supportEmail', () => {
      const payload = {
        supportEmail: 'new@example.com',
      };

      const result = UpdateTenantPayloadSchema.safeParse(payload);

      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data.supportEmail).toBe(payload.supportEmail);
      }
    });

    test('should reject invalid supportEmail in update', () => {
      const payload = {
        supportEmail: 'invalid-email-format',
      };

      const result = UpdateTenantPayloadSchema.safeParse(payload);

      expect(result.success).toBe(false);
    });

    test('should parse empty update payload', () => {
      const payload = {};

      const result = UpdateTenantPayloadSchema.safeParse(payload);

      expect(result.success).toBe(true);
    });
  });
});
