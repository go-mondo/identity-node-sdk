import { type } from 'arktype';
import { describe, expect, test } from 'vitest';
import { generateAppId } from '../../app/utils.js';
import { generateUserId } from '../../customer/schema.js';
import { generatePermissionId, generateRoleId } from '../schema.js';
import {
  type InsertRolePayload,
  InsertRolePayloadSchema,
  type RoleAssociationReference,
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
      const result = RoleIdPropertySchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual({ id: payload.id });
    });

    test('should reject missing id', () => {
      const result = RoleIdPropertySchema({});
      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('RoleAssociationsSchema', () => {
    test('should accept valid associations', () => {
      const payload = {
        apps: [generateAppId(), generateAppId()],
        permissions: [generatePermissionId(), generatePermissionId()],
        users: [generateUserId(), generateUserId()],
      };

      const result = RoleAssociationsSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual({
        apps: payload.apps,
        permissions: payload.permissions,
        users: payload.users,
      });
    });

    test('should accept optional associations', () => {
      const result = RoleAssociationsSchema({});
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual({});
    });

    test('should accept partial associations', () => {
      const result = RoleAssociationsSchema({
        permissions: [generatePermissionId()],
        users: undefined,
      });
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should reject non-array associations', () => {
      const result = RoleAssociationsSchema({
        apps: 'not-an-array',
      });
      expect(result).toBeInstanceOf(type.errors);
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

      const result = RoleSchema(role);
      expect(result).not.toBeInstanceOf(type.errors);
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

      const result = RoleSchema(role);
      expect(result).not.toBeInstanceOf(type.errors);
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

      const result = RoleSchema(role);
      expect(result).not.toBeInstanceOf(type.errors);
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

      const result = RoleSchema(role);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject missing required fields', () => {
      const role = {
        id: generateRoleId(),
        name: 'admin',
      };

      const result = RoleSchema(role);
      expect(result).toBeInstanceOf(type.errors);
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

      const result = InsertRolePayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept minimal insert payload', () => {
      const payload = {
        name: 'user',
      };

      const result = InsertRolePayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect((result as InsertRolePayload).status).toBe('enabled'); // default value
    });

    test('should generate default ID when not provided', () => {
      const payload = { name: 'admin' };
      const result = InsertRolePayloadSchema(payload);

      expect(result).not.toBeInstanceOf(type.errors);
      expect((result as InsertRolePayload).id).toMatch(/^rol_/);
    });

    test('should reject missing name', () => {
      const result = InsertRolePayloadSchema({});
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should accept associations in insert payload', () => {
      const payload = {
        name: 'moderator',
        apps: [generateAppId(), generateAppId()],
        permissions: [generatePermissionId(), generatePermissionId()],
        users: [generateUserId()],
      };

      const result = InsertRolePayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
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

      const result = UpdateRolePayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should accept empty update payload', () => {
      const result = UpdateRolePayloadSchema({});
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual({});
    });

    test('should accept partial updates', () => {
      const payload = { name: 'new-name' };
      const result = UpdateRolePayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should reject invalid status', () => {
      const payload = { status: 'invalid-status' };
      const result = UpdateRolePayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
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

      const result = RoleAssociationReferenceSchema(reference);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(reference);
    });

    test('should use default status when not provided', () => {
      const reference = {
        id: generateRoleId(),
        name: 'admin',
        model: 'Role' as const,
      };

      const result = RoleAssociationReferenceSchema(reference);
      expect(result).not.toBeInstanceOf(type.errors);
      expect((result as RoleAssociationReference).status).toBe('disabled'); // default value
    });

    test('should reject missing required fields', () => {
      const reference = { id: generateRoleId() };
      const result = RoleAssociationReferenceSchema(reference);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject invalid model value', () => {
      const reference = {
        id: generateRoleId(),
        name: 'admin',
        model: 'InvalidModel',
      };

      const result = RoleAssociationReferenceSchema(reference);
      expect(result).toBeInstanceOf(type.errors);
    });
  });
});
