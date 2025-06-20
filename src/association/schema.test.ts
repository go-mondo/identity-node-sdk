import { type } from 'arktype';
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
      const result = AssociationIdReferenceSchema(reference);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(reference);
    });

    test('should reject missing id', () => {
      const result = AssociationIdReferenceSchema({});
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject non-string id', () => {
      const reference = { id: 123 };
      const result = AssociationIdReferenceSchema(reference);
      expect(result).toBeInstanceOf(type.errors);
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

      const result = AssociationAttributesReferenceSchema(reference);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(reference);
    });

    test('should accept minimal reference with just id', () => {
      const reference = { id: 'minimal_id' };
      const result = AssociationAttributesReferenceSchema(reference);
      expect(result).not.toBeInstanceOf(type.errors);
      expect(result).toEqual(reference);
    });

    test('should reject missing id', () => {
      const reference = { name: 'Test', status: 'active' };
      const result = AssociationAttributesReferenceSchema(reference);
      expect(result).toBeInstanceOf(type.errors);
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

      const result = AssociationObjectSchema(appAssociation);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept Role association reference', () => {
      const roleAssociation = {
        id: generateRoleId(),
        name: 'admin',
        status: 'enabled' as const,
        model: 'Role' as const,
      };

      const result = AssociationObjectSchema(roleAssociation);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should accept Permission association reference', () => {
      const permissionAssociation = {
        id: generatePermissionId(),
        name: 'read:users',
        status: 'enabled' as const,
        model: 'Permission' as const,
      };

      const result = AssociationObjectSchema(permissionAssociation);
      expect(result).not.toBeInstanceOf(type.errors);
    });

    test('should reject invalid association object', () => {
      const invalidAssociation = {
        id: 'test_id',
        name: 'Test',
        model: 'InvalidModel',
      };

      const result = AssociationObjectSchema(invalidAssociation);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject association missing required fields', () => {
      const incompleteAssociation = {
        id: generateUserId(),
        // missing required fields for any valid association type
      };

      const result = AssociationObjectSchema(incompleteAssociation);
      expect(result).toBeInstanceOf(type.errors);
    });

    test('should reject association with mismatched model and data', () => {
      const mismatchedAssociation = {
        id: generateUserId(),
        name: 'admin', // role field
        status: 'enabled' as const,
        model: 'User' as const, // but missing user fields
      };

      const result = AssociationObjectSchema(mismatchedAssociation);
      expect(result).toBeInstanceOf(type.errors);
    });
  });
});
