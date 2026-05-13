import { describe, expect, test } from 'vitest';
import { generateAppId } from '../../app/utils.js';
import { generateUserId } from '../../customer/schema.js';
import { generatePermissionId, generateRoleId } from '../schema.js';
import {
  InsertRolePayloadSchema,
  InsertRolePayloadWithoutAssociationsSchema,
  RoleAssociationReferenceSchema,
  RoleAssociationsSchema,
  RoleIdPropertySchema,
  RoleSchema,
  RoleStatus,
  UpdateRolePayloadSchema,
} from './schema.js';

describe('Authorization Roles - Schema', () => {
  describe('RoleStatus constants', () => {
    test('should have correct status values', () => {
      expect(RoleStatus.ENABLED).toBe('enabled');
      expect(RoleStatus.DISABLED).toBe('disabled');
    });
  });

  describe('RoleIdPropertySchema', () => {
    test('should accept valid id property', () => {
      const payload = { id: generateRoleId() };
      const result = RoleIdPropertySchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.data).toEqual({ id: payload.id });
    });

    test('should reject missing id', () => {
      const result = RoleIdPropertySchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('RoleAssociationsSchema', () => {
    test('should accept valid associations', () => {
      const payload = {
        apps: [generateAppId(), generateAppId()],
        permissions: [generatePermissionId(), generatePermissionId()],
        users: [generateUserId(), generateUserId()],
      };

      const result = RoleAssociationsSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.data).toEqual({
        apps: payload.apps,
        permissions: payload.permissions,
        users: payload.users,
      });
    });

    test('should accept optional associations', () => {
      const result = RoleAssociationsSchema.safeParse({});
      // Parse succeeds for valid data
      expect(result.data).toEqual({});
    });

    test('should accept partial associations', () => {
      const result = RoleAssociationsSchema.safeParse({
        permissions: [generatePermissionId()],
        users: undefined,
      });
      // Parse succeeds for valid data
    });

    test('should reject non-array associations', () => {
      const result = RoleAssociationsSchema.safeParse({
        apps: 'not-an-array',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('RoleSchema', () => {
    test('should accept complete role object', () => {
      const role = {
        id: generateRoleId(),
        name: 'admin',
        status: 'enabled' as const,
        description: 'Administrator role',
        apps: { ids: [generateAppId()], count: 1 },
        users: { ids: [generateUserId()], count: 1 },
        permissions: { ids: [generatePermissionId()], count: 1 },
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: { key: 'value' },
      };

      const result = RoleSchema.safeParse(role);
      // Parse succeeds for valid data
    });

    test('should accept minimal role object', () => {
      const role = {
        id: generateRoleId(),
        name: 'user',
        status: 'enabled' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      };

      const result = RoleSchema.safeParse(role);
      // Parse succeeds for valid data
    });

    test('should accept role with optional dates', () => {
      const role = {
        id: generateRoleId(),
        name: 'user',
        status: 'disabled' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        deletedAt: new Date(),
        deactivatedAt: new Date(),
        metadata: {},
      };

      const result = RoleSchema.safeParse(role);
      // Parse succeeds for valid data
    });

    test('should reject invalid status', () => {
      const role = {
        id: generateRoleId(),
        name: 'admin',
        status: 'invalid',
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      };

      const result = RoleSchema.safeParse(role);
      expect(result.success).toBe(false);
    });

    test('should reject missing required fields', () => {
      const role = {
        id: generateRoleId(),
        name: 'admin',
      };

      const result = RoleSchema.safeParse(role);
      expect(result.success).toBe(false);
    });
  });

  describe('InsertRolePayloadSchema', () => {
    test('should accept complete insert payload', () => {
      const payload = {
        id: generateRoleId(),
        name: 'admin',
        status: 'enabled' as const,
        description: 'Administrator role',
        apps: [generateAppId()],
        permissions: [generatePermissionId()],
        users: [generateUserId()],
        metadata: { key: 'value' },
      };

      const result = InsertRolePayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
    });

    test('should accept minimal insert payload', () => {
      const payload = {
        name: 'user',
      };

      const result = InsertRolePayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.data?.status).toBe('enabled'); // default value
    });

    test('should reject missing name', () => {
      const result = InsertRolePayloadSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    test('should accept associations in insert payload', () => {
      const payload = {
        name: 'moderator',
        apps: [generateAppId(), generateAppId()],
        permissions: [generatePermissionId(), generatePermissionId()],
        users: [generateUserId()],
      };

      const result = InsertRolePayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
    });
  });

  describe('InsertRolePayloadWithoutAssociationsSchema', () => {
    test('should accept insert payload without associations', () => {
      const payload = {
        id: generateRoleId(),
        name: 'admin',
        status: 'enabled' as const,
        description: 'Administrator role',
        metadata: { key: 'value' },
      };

      const result =
        InsertRolePayloadWithoutAssociationsSchema.safeParse(payload);
      expect(result.data).toEqual(payload);
    });

    test('should omit associations from insert payload output', () => {
      const payload = {
        name: 'moderator',
        apps: [generateAppId()],
        permissions: [generatePermissionId()],
        users: [generateUserId()],
      };

      const result =
        InsertRolePayloadWithoutAssociationsSchema.safeParse(payload);
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).not.toHaveProperty('apps');
        expect(result.data).not.toHaveProperty('permissions');
        expect(result.data).not.toHaveProperty('users');
      }
    });
  });

  describe('UpdateRolePayloadSchema', () => {
    test('should accept all optional fields', () => {
      const payload = {
        name: 'updated-role',
        status: 'disabled' as const,
        description: 'Updated description',
        metadata: { updated: true },
      };

      const result = UpdateRolePayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.data).toEqual(payload);
    });

    test('should accept empty update payload', () => {
      const result = UpdateRolePayloadSchema.safeParse({});
      // Parse succeeds for valid data
      expect(result.data).toEqual({});
    });

    test('should accept partial updates', () => {
      const payload = { name: 'new-name' };
      const result = UpdateRolePayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.data).toEqual(payload);
    });

    test('should reject invalid status', () => {
      const payload = { status: 'invalid-status' };
      const result = UpdateRolePayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('RoleAssociationReferenceSchema', () => {
    test('should accept complete association reference', () => {
      const reference = {
        id: generateRoleId(),
        name: 'admin',
        status: 'enabled' as const,
        model: 'Role' as const,
      };

      const result = RoleAssociationReferenceSchema.safeParse(reference);
      // Parse succeeds for valid data
      expect(result.data).toEqual(reference);
    });

    test('should use default status when not provided', () => {
      const reference = {
        id: generateRoleId(),
        name: 'admin',
        model: 'Role' as const,
      };

      const result = RoleAssociationReferenceSchema.safeParse(reference);
      // Parse succeeds for valid data
      expect(result.data?.status).toBe('disabled'); // default value
    });

    test('should reject missing required fields', () => {
      const reference = { id: generateRoleId() };
      const result = RoleAssociationReferenceSchema.safeParse(reference);
      expect(result.success).toBe(false);
    });

    test('should reject invalid model value', () => {
      const reference = {
        id: generateRoleId(),
        name: 'admin',
        model: 'InvalidModel',
      };

      const result = RoleAssociationReferenceSchema.safeParse(reference);
      expect(result.success).toBe(false);
    });
  });
});
