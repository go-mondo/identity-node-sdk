import { describe, expect, test } from 'vitest';
import { Model, generateActivityId } from './utils.js';

describe('Activity Schema - Utils', () => {
  describe('Model constants', () => {
    test('should have correct UID prefix', () => {
      expect(Model.Activity.UIDPrefix).toBe('act');
    });
  });

  describe('generateActivityId', () => {
    test('should generate ID with correct prefix', () => {
      const id = generateActivityId();
      expect(id).toMatch(/^act_[A-Za-z0-9]+$/);
    });

    test('should generate unique IDs', () => {
      const id1 = generateActivityId();
      const id2 = generateActivityId();
      expect(id1).not.toBe(id2);
    });

    test('should generate IDs with correct length', () => {
      const id = generateActivityId();
      expect(id.length).toBeGreaterThan(4); // prefix + underscore + KSUID
    });
  });
});
