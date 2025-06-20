import { describe, expect, test } from 'vitest';
import { Model, generateActionId } from './utils.js';

describe('Action Schema - Utils', () => {
  describe('Model constants', () => {
    test('should have correct UID prefix', () => {
      expect(Model.Action.UIDPrefix).toBe('atn');
    });
  });

  describe('generateActionId', () => {
    test('should generate ID with correct prefix', () => {
      const id = generateActionId();
      expect(id).toMatch(/^atn_[A-Za-z0-9]+$/);
    });

    test('should generate unique IDs', () => {
      const id1 = generateActionId();
      const id2 = generateActionId();
      expect(id1).not.toBe(id2);
    });

    test('should generate IDs with correct length', () => {
      const id = generateActionId();
      expect(id.length).toBeGreaterThan(4); // prefix + underscore + KSUID
    });
  });
});
