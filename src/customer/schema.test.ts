import { describe, expect, test } from 'vitest';
import { Model, generateOrganizationId, generateUserId } from './schema.js';

describe('Customer Schema - Utils', () => {
  describe('Model constants', () => {
    test('should have correct UID prefixes', () => {
      expect(Model.Organization.UIDPrefix).toBe('org');
      expect(Model.User.UIDPrefix).toBe('usr');
    });
  });

  describe('generateUserId', () => {
    test('should generate ID with correct prefix', () => {
      const id = generateUserId();
      expect(id).toMatch(/^usr_[A-Za-z0-9]+$/);
    });

    test('should generate unique IDs', () => {
      const id1 = generateUserId();
      const id2 = generateUserId();
      expect(id1).not.toBe(id2);
    });

    test('should generate IDs with correct length', () => {
      const id = generateUserId();
      expect(id.length).toBeGreaterThan(4); // prefix + underscore + KSUID
    });
  });

  describe('generateOrganizationId', () => {
    test('should generate ID with correct prefix', () => {
      const id = generateOrganizationId();
      expect(id).toMatch(/^org_[A-Za-z0-9]+$/);
    });

    test('should generate unique IDs', () => {
      const id1 = generateOrganizationId();
      const id2 = generateOrganizationId();
      expect(id1).not.toBe(id2);
    });

    test('should generate IDs with correct length', () => {
      const id = generateOrganizationId();
      expect(id.length).toBeGreaterThan(4); // prefix + underscore + KSUID
    });
  });
});
