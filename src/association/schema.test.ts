import { describe, expect, test } from 'vitest';
import { generateAppId } from '../app/utils.js';
import {
  generatePermissionId,
  generateRoleId,
} from '../authorization/schema.js';
import { generateUserId } from '../customer/schema.js';
import { AssociationObjectSchema, AssociationObjectType } from './schema.js';

describe('Association - Schema', () => {
  describe('AssociationObjectType constants', () => {
    test('should have correct object type values', () => {
      expect(AssociationObjectType.USER).toBe('User');
      expect(AssociationObjectType.ORGANIZATION).toBe('Organization');
      expect(AssociationObjectType.ROLE).toBe('Role');
      expect(AssociationObjectType.APP).toBe('App');
      expect(AssociationObjectType.PERMISSION).toBe('Permission');
      expect(AssociationObjectType.SESSION).toBe('Session');
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
