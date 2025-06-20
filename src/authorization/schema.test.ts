import { describe, expect, test } from 'vitest';
import { Model, generatePermissionId, generateRoleId } from './schema.js';

describe('Authorization - Utils', () => {
  describe('Model constants', () => {
    test('should have correct UID prefixes', () => {
      expect(Model.Permission.UIDPrefix).toBe('per');
      expect(Model.Role.UIDPrefix).toBe('rol');
    });
  });

  describe('generatePermissionId', () => {
    test('should generate ID with correct prefix', () => {
      const id = generatePermissionId();
      expect(id).toMatch(/^per_[A-Za-z0-9]+$/);
    });

    test('should generate unique IDs', () => {
      const id1 = generatePermissionId();
      const id2 = generatePermissionId();
      expect(id1).not.toBe(id2);
    });

    test('should generate IDs with correct length', () => {
      const id = generatePermissionId();
      expect(id.length).toBeGreaterThan(4); // prefix + underscore + KSUID
    });
  });

  describe('generateRoleId', () => {
    test('should generate ID with correct prefix', () => {
      const id = generateRoleId();
      expect(id).toMatch(/^rol_[A-Za-z0-9]+$/);
    });

    test('should generate unique IDs', () => {
      const id1 = generateRoleId();
      const id2 = generateRoleId();
      expect(id1).not.toBe(id2);
    });

    test('should generate IDs with correct length', () => {
      const id = generateRoleId();
      expect(id.length).toBeGreaterThan(4); // prefix + underscore + KSUID
    });
  });
});
