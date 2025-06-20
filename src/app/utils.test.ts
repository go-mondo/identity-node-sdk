import { describe, expect, test } from 'vitest';
import { Model, generateAppId, generateOAuthId } from './utils.js';

describe('App - Utils', () => {
  describe('Model constants', () => {
    test('should have correct UID prefixes', () => {
      expect(Model.App.UIDPrefix).toBe('app');
      expect(Model.OAuth.UIDPrefix).toBe('aoa');
    });
  });

  describe('generateAppId', () => {
    test('should generate ID with correct prefix', () => {
      const id = generateAppId();
      expect(id).toMatch(/^app_[A-Za-z0-9]+$/);
    });

    test('should generate unique IDs', () => {
      const id1 = generateAppId();
      const id2 = generateAppId();
      expect(id1).not.toBe(id2);
    });

    test('should generate IDs with correct length', () => {
      const id = generateAppId();
      expect(id.length).toBeGreaterThan(4); // prefix + underscore + KSUID
    });
  });

  describe('generateOAuthId', () => {
    test('should generate ID with correct prefix', () => {
      const id = generateOAuthId();
      expect(id).toMatch(/^aoa_[A-Za-z0-9]+$/);
    });

    test('should generate unique IDs', () => {
      const id1 = generateOAuthId();
      const id2 = generateOAuthId();
      expect(id1).not.toBe(id2);
    });

    test('should generate IDs with correct length', () => {
      const id = generateOAuthId();
      expect(id.length).toBeGreaterThan(4); // prefix + underscore + KSUID
    });
  });
});
