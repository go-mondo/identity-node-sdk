import { describe, expect, test } from 'vitest';
import { generateAppId } from '../app/utils.js';
import {
  generatePermissionId,
  generateRoleId,
} from '../authorization/schema.js';
import { generateUserId } from '../customer/schema.js';
import {
  AssociationObjectType,
  AssociationIdReferenceSchema,
  AssociationAttributesReferenceSchema,
  AssociationObjectSchema,
} from './schema.js';

describe('Association - Schema', () => {
  describe('AssociationObjectType constants', () => {
    test('should have correct object type values', () => {
      expect(AssociationObjectType.USER).toBe('User');
      expect(AssociationObjectType.ORGANIZATION).toBe('Organization');
      expect(AssociationObjectType.ROLE).toBe('Role');
      expect(AssociationObjectType.APP).toBe('App');
      expect(AssociationObjectType.PERMISSION).toBe('Permission');
    });
  });

  describe('AssociationIdReferenceSchema', () => {
    test('should accept valid id reference', () => {
      const reference = { id: 'any_string_id' };
      const result = AssociationIdReferenceSchema.safeParse(reference);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(reference);
      }
    });

    test('should reject missing id', () => {
      const result = AssociationIdReferenceSchema.safeParse({});
      expect(result.success).toBe(false);
    });

    test('should reject non-string id', () => {
      const reference = { id: 123 };
      const result = AssociationIdReferenceSchema.safeParse(reference);
      expect(result.success).toBe(false);
    });
  });

  describe('AssociationAttributesReferenceSchema', () => {
    test('should accept id with additional attributes', () => {
      const reference = {
        id: 'test_id',
        name: 'Test Name',
        status: 'active',
        metadata: { key: 'value' },
      };

      const result = AssociationAttributesReferenceSchema.safeParse(reference);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(reference);
      }
    });

    test('should accept minimal reference with just id', () => {
      const reference = { id: 'minimal_id' };
      const result = AssociationAttributesReferenceSchema.safeParse(reference);
      // Parse succeeds for valid data
      expect(result.success).toBe(true);
      if (result.success) {
        expect(result.data).toEqual(reference);
      }
    });

    test('should reject missing id', () => {
      const reference = { name: 'Test', status: 'active' };
      const result = AssociationAttributesReferenceSchema.safeParse(reference);
      expect(result.success).toBe(false);
    });
  });

  describe('AssociationObjectSchema', () => {
    // Note: User association reference has complex requirements
    // that depend on UserNamePropertiesSchema and EmailOrPhonePropertiesSchema

    test('should accept App association reference', () => {
      const appAssociation = {
        id: generateAppId(),
        status: 'enabled' as const,
        label: 'Test App',
        model: 'App' as const,
      };

      const result = AssociationObjectSchema.safeParse(appAssociation);
      // Parse succeeds for valid data
    });

    test('should accept Role association reference', () => {
      const roleAssociation = {
        id: generateRoleId(),
        name: 'admin',
        status: 'enabled' as const,
        model: 'Role' as const,
      };

      const result = AssociationObjectSchema.safeParse(roleAssociation);
      // Parse succeeds for valid data
    });

    test('should accept Permission association reference', () => {
      const permissionAssociation = {
        id: generatePermissionId(),
        name: 'read:users',
        status: 'enabled' as const,
        model: 'Permission' as const,
      };

      const result = AssociationObjectSchema.safeParse(permissionAssociation);
      // Parse succeeds for valid data
    });

    test('should reject invalid association object', () => {
      const invalidAssociation = {
        id: 'test_id',
        name: 'Test',
        model: 'InvalidModel',
      };

      const result = AssociationObjectSchema.safeParse(invalidAssociation);
      expect(result.success).toBe(false);
    });

    test('should reject association missing required fields', () => {
      const incompleteAssociation = {
        id: generateUserId(),
        // missing required fields for any valid association type
      };

      const result = AssociationObjectSchema.safeParse(incompleteAssociation);
      expect(result.success).toBe(false);
    });

    test('should reject association with mismatched model and data', () => {
      const mismatchedAssociation = {
        id: generateUserId(),
        name: 'admin', // role field
        status: 'enabled' as const,
        model: 'User' as const, // but missing user fields
      };

      const result = AssociationObjectSchema.safeParse(mismatchedAssociation);
      expect(result.success).toBe(false);
    });
  });
});
