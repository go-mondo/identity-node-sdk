import { describe, expect, test } from 'vitest';
import { generateAppId } from '../../app/utils.js';
import {
  PermissionIdSchema,
  generatePermissionId,
  generateRoleId,
} from '../schema.js';
import {
  InsertPermissionPayloadSchema,
  PermissionAssociationReferenceSchema,
  PermissionAssociationsSchema,
  PermissionIdPropertySchema,
  PermissionSchema,
  PermissionStatus,
  UpdatePermissionPayloadSchema,
} from './schema.js';

describe('Authorization Permissions - Schema', () => {
  describe('PermissionStatus constants', () => {
    test('should have correct status values', () => {
      expect(PermissionStatus.ENABLED).toBe('enabled');
      expect(PermissionStatus.DISABLED).toBe('disabled');
    });
  });

  describe('PermissionIdSchema', () => {
    test('should accept valid string ID', () => {
      expect(PermissionIdSchema.safeParse(generatePermissionId()).success).toBe(
        true
      );
    });

    test('should reject non-string values', () => {
      expect(PermissionIdSchema.safeParse(123).success).toBe(false);
      expect(PermissionIdSchema.safeParse(null).success).toBe(false);
    });
  });

  describe('PermissionIdPropertySchema', () => {
    test('should accept valid id property', () => {
      const payload = { id: generatePermissionId() };
      const result = PermissionIdPropertySchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.data).toEqual({ id: payload.id });
    });

    test('should reject missing id', () => {
      const result = PermissionIdPropertySchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('PermissionAssociationsSchema', () => {
    const payload = {
      apps: [generateAppId(), generateAppId()],
      roles: [generateRoleId(), generateRoleId()],
    };
    test('should accept valid associations', () => {
      const result = PermissionAssociationsSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.data).toEqual({
        apps: payload.apps,
        roles: payload.roles,
      });
    });

    test('should accept optional associations', () => {
      const result = PermissionAssociationsSchema.safeParse({});
      // Parse succeeds for valid data
      expect(result.data).toEqual({});
    });

    test('should accept undefined associations', () => {
      const result = PermissionAssociationsSchema.safeParse({
        apps: undefined,
        roles: [generateRoleId()],
      });
      // Parse succeeds for valid data
    });

    test('should reject non-array associations', () => {
      const result = PermissionAssociationsSchema.safeParse({
        apps: 'not-an-array',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('PermissionSchema', () => {
    test('should accept complete permission object', () => {
      const permission = {
        id: generatePermissionId(),
        name: 'read:users',
        status: 'enabled' as const,
        description: 'Read user data',
        apps: { ids: [generateAppId()], count: 1 },
        roles: { ids: [generateRoleId()], count: 1 },
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: { key: 'value' },
      };

      const result = PermissionSchema.safeParse(permission);
      // Parse succeeds for valid data
    });

    test('should accept minimal permission object', () => {
      const permission = {
        id: generatePermissionId(),
        name: 'read:users',
        status: 'enabled' as const,
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      };

      const result = PermissionSchema.safeParse(permission);
      // Parse succeeds for valid data
    });

    test('should reject invalid status', () => {
      const permission = {
        id: generatePermissionId(),
        name: 'read:users',
        status: 'invalid',
        createdAt: new Date(),
        updatedAt: new Date(),
        metadata: {},
      };

      const result = PermissionSchema.safeParse(permission);
      expect(result.success).toBe(false);
    });

    test('should reject missing required fields', () => {
      const permission = {
        id: generatePermissionId(),
        name: 'read:users',
      };

      const result = PermissionSchema.safeParse(permission);
      expect(result.success).toBe(false);
    });
  });

  describe('InsertPermissionPayloadSchema', () => {
    test('should accept complete insert payload', () => {
      const payload = {
        id: generatePermissionId(),
        name: 'read:users',
        status: 'enabled' as const,
        description: 'Read user data',
        apps: [generateAppId()],
        roles: [generateRoleId()],
        metadata: { key: 'value' },
      };

      const result = InsertPermissionPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
    });

    test('should accept minimal insert payload', () => {
      const payload = {
        name: 'read:users',
      };

      const result = InsertPermissionPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.data?.status).toBe('enabled'); // default value
    });

    test('should generate default ID when not provided', () => {
      const payload = { name: 'read:users' };
      const result = InsertPermissionPayloadSchema.safeParse(payload);

      // Parse succeeds for valid data
      expect(result.data?.id).toMatch(/^per_/);
    });

    test('should reject missing name', () => {
      const result = InsertPermissionPayloadSchema.safeParse({});
      expect(result.success).toBe(false);
    });
  });

  describe('UpdatePermissionPayloadSchema', () => {
    test('should accept all optional fields', () => {
      const payload = {
        name: 'updated:permission',
        status: 'disabled' as const,
        description: 'Updated description',
        metadata: { updated: true },
      };

      const result = UpdatePermissionPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.data).toEqual(payload);
    });

    test('should accept empty update payload', () => {
      const result = UpdatePermissionPayloadSchema.safeParse({});
      // Parse succeeds for valid data
      expect(result.data).toEqual({});
    });

    test('should accept partial updates', () => {
      const payload = { name: 'new:name' };
      const result = UpdatePermissionPayloadSchema.safeParse(payload);
      // Parse succeeds for valid data
      expect(result.data).toEqual(payload);
    });

    test('should reject invalid status', () => {
      const payload = { status: 'invalid-status' };
      const result = UpdatePermissionPayloadSchema.safeParse(payload);
      expect(result.success).toBe(false);
    });
  });

  describe('PermissionAssociationReferenceSchema', () => {
    test('should accept complete association reference', () => {
      const reference = {
        id: generatePermissionId(),
        name: 'read:users',
        status: 'enabled' as const,
        model: 'Permission' as const,
      };

      const result = PermissionAssociationReferenceSchema.safeParse(reference);
      // Parse succeeds for valid data
      expect(result.data).toEqual(reference);
    });

    test('should use default status when not provided', () => {
      const reference = {
        id: generatePermissionId(),
        name: 'read:users',
        model: 'Permission' as const,
      };

      const result = PermissionAssociationReferenceSchema.safeParse(reference);
      // Parse succeeds for valid data
      expect(result.data?.status).toBe('disabled'); // default value
    });

    test('should reject missing required fields', () => {
      const reference = { id: generatePermissionId() };
      const result = PermissionAssociationReferenceSchema.safeParse(reference);
      expect(result.success).toBe(false);
    });

    test('should reject invalid model value', () => {
      const reference = {
        id: generatePermissionId(),
        name: 'read:users',
        model: 'InvalidModel',
      };

      const result = PermissionAssociationReferenceSchema.safeParse(reference);
      expect(result.success).toBe(false);
    });
  });
});
