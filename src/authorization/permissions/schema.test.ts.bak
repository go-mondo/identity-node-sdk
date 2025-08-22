import { type } from 'arktype';
import { describe, expect, test } from 'vitest';
import { generateAppId } from '../../app/utils.js';
import {
  PermissionIdSchema,
  generatePermissionId,
  generateRoleId,
} from '../schema.js';
import {
  type InsertPermissionPayload,
  InsertPermissionPayloadSchema,
  type PermissionAssociationReference,
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
      const result = PermissionIdSchema(generatePermissionId());
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should reject non-string values', () => {
      expect(PermissionIdSchema(123)).toBeInstanceOf(type.errors);
      expect(PermissionIdSchema(null)).toBeInstanceOf(type.errors);
    });
  });

  describe('PermissionIdPropertySchema', () => {
    test('should accept valid id property', () => {
      const payload = { id: generatePermissionId() };
      const result = PermissionIdPropertySchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual({ id: payload.id });
    });

    test('should reject missing id', () => {
      const result = PermissionIdPropertySchema({});
      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('PermissionAssociationsSchema', () => {
    const payload = {
      apps: [generateAppId(), generateAppId()],
      roles: [generateRoleId(), generateRoleId()],
    };
    test('should accept valid associations', () => {
      const result = PermissionAssociationsSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual({
        apps: payload.apps,
        roles: payload.roles,
      });
    });

    test('should accept optional associations', () => {
      const result = PermissionAssociationsSchema({});
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual({});
    });

    test('should accept undefined associations', () => {
      const result = PermissionAssociationsSchema({
        apps: undefined,
        roles: [generateRoleId()],
      });
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should reject non-array associations', () => {
      const result = PermissionAssociationsSchema({
        apps: 'not-an-array',
      });
      expect(result).toBeInstanceOf(type.errors);
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

      const result = PermissionSchema(permission);
      expect(result).not.toBeInstanceOf(type.errors);
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

      const result = PermissionSchema(permission);
      expect(result).not.toBeInstanceOf(type.errors);
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

      const result = PermissionSchema(permission);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject missing required fields', () => {
      const permission = {
        id: generatePermissionId(),
        name: 'read:users',
      };

      const result = PermissionSchema(permission);
      expect(result).toBeInstanceOf(type.errors);
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

      const result = InsertPermissionPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept minimal insert payload', () => {
      const payload = {
        name: 'read:users',
      };

      const result = InsertPermissionPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect((result as InsertPermissionPayload).status).toBe('enabled'); // default value
    });

    test('should generate default ID when not provided', () => {
      const payload = { name: 'read:users' };
      const result = InsertPermissionPayloadSchema(payload);

      expect(result).not.toBeInstanceOf(type.errors);
      expect((result as InsertPermissionPayload).id).toMatch(/^per_/);
    });

    test('should reject missing name', () => {
      const result = InsertPermissionPayloadSchema({});
      expect(result).toBeInstanceOf(type.errors);
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

      const result = UpdatePermissionPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should accept empty update payload', () => {
      const result = UpdatePermissionPayloadSchema({});
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual({});
    });

    test('should accept partial updates', () => {
      const payload = { name: 'new:name' };
      const result = UpdatePermissionPayloadSchema(payload);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(payload);
    });

    test('should reject invalid status', () => {
      const payload = { status: 'invalid-status' };
      const result = UpdatePermissionPayloadSchema(payload);
      expect(result).toBeInstanceOf(type.errors);
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

      const result = PermissionAssociationReferenceSchema(reference);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(reference);
    });

    test('should use default status when not provided', () => {
      const reference = {
        id: generatePermissionId(),
        name: 'read:users',
        model: 'Permission' as const,
      };

      const result = PermissionAssociationReferenceSchema(reference);
      expect(result).not.toBeInstanceOf(type.errors);
      expect((result as PermissionAssociationReference).status).toBe(
        'disabled'
      ); // default value
    });

    test('should reject missing required fields', () => {
      const reference = { id: generatePermissionId() };
      const result = PermissionAssociationReferenceSchema(reference);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject invalid model value', () => {
      const reference = {
        id: generatePermissionId(),
        name: 'read:users',
        model: 'InvalidModel',
      };

      const result = PermissionAssociationReferenceSchema(reference);
      expect(result).toBeInstanceOf(type.errors);
    });
  });
});
