import { describe, expect, test } from 'vitest';
import {
  Model,
  generateHandle,
  generateNotificationId,
  generateTenantId,
} from './utils.js';

describe('Workspace - Utils', () => {
  describe('Model constants', () => {
    test('should have correct UID prefixes', () => {
      expect(Model.Notification.UIDPrefix).toBe('ntf');
      expect(Model.Tenant.UIDPrefix).toBe('tnt');
    });
  });

  describe('generateTenantId', () => {
    test('should generate ID with correct prefix', () => {
      const id = generateTenantId();
      expect(id).toMatch(/^tnt_[A-Za-z0-9]+$/);
    });

    test('should generate unique IDs', () => {
      const id1 = generateTenantId();
      const id2 = generateTenantId();
      expect(id1).not.toBe(id2);
    });

    test('should generate IDs with correct length', () => {
      const id = generateTenantId();
      expect(id.length).toBeGreaterThan(4); // prefix + underscore + KSUID
    });
  });

  describe('generateHandle', () => {
    test('should generate 12-character hex string', () => {
      const handle = generateHandle();
      expect(handle).toMatch(/^[a-f0-9]{12}$/);
      expect(handle.length).toBe(12);
    });

    test('should generate unique handles', () => {
      const handle1 = generateHandle();
      const handle2 = generateHandle();
      expect(handle1).not.toBe(handle2);
    });

    test('should only contain lowercase hex characters', () => {
      const handle = generateHandle();
      expect(handle).toMatch(/^[a-f0-9]+$/);
    });

    test('should generate consistent length handles', () => {
      const handles = Array.from({ length: 10 }, () => generateHandle());
      const lengths = handles.map((h) => h.length);
      expect(lengths.every((l) => l === 12)).toBe(true);
    });
  });

  describe('generateNotificationId', () => {
    test('should generate ID with correct prefix', () => {
      const id = generateNotificationId();
      expect(id).toMatch(/^ntf_[A-Za-z0-9]+$/);
    });

    test('should generate unique IDs', () => {
      const id1 = generateNotificationId();
      const id2 = generateNotificationId();
      expect(id1).not.toBe(id2);
    });

    test('should generate IDs with correct length', () => {
      const id = generateNotificationId();
      expect(id.length).toBeGreaterThan(4); // prefix + underscore + KSUID
    });
  });
});
