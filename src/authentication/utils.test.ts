import { describe, expect, test } from 'vitest';
import { Model, generateSessionId, generateStrategyId } from './utils.js';

describe('Authentication Utils', () => {
  describe('Model constants', () => {
    test('should have correct Strategy model properties', () => {
      expect(Model.Strategy.UIDPrefix).toBe('stg');
      expect(Model.Strategy.TYPE).toBe('Strategy');
    });

    test('should have correct Session model properties', () => {
      expect(Model.Session.UIDPrefix).toBe('ssn');
      expect(Model.Session.TYPE).toBe('Session');
    });

    test('should be readonly (const assertion)', () => {
      // Test that the Model object is properly typed as const
      expect(typeof Model).toBe('object');
      expect(Object.isFrozen(Model)).toBe(false); // const assertion doesn't freeze at runtime
    });
  });

  describe('generateStrategyId', () => {
    test('should generate ID with correct prefix', () => {
      const id = generateStrategyId();
      expect(id).toMatch(/^stg_/);
    });

    test('should generate ID with correct format', () => {
      const id = generateStrategyId();
      // Should match: prefix + underscore + KSUID (27 characters)
      expect(id).toMatch(/^stg_[A-Za-z0-9]{27}$/);
    });

    test('should generate unique IDs on multiple calls', () => {
      const id1 = generateStrategyId();
      const id2 = generateStrategyId();
      const id3 = generateStrategyId();

      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
    });

    test('should generate IDs with correct total length', () => {
      const id = generateStrategyId();
      // prefix (3) + underscore (1) + KSUID (27) = 31 characters
      expect(id.length).toBe(31);
    });

    test('should generate IDs that start with strategy prefix', () => {
      const ids = Array.from({ length: 10 }, () => generateStrategyId());

      for (const id of ids) {
        expect(id.startsWith('stg_')).toBe(true);
      }
    });

    test('should generate KSUID-compatible format', () => {
      const id = generateStrategyId();
      const ksuidPart = id.substring(4); // Remove 'stg_'

      // KSUID should be 27 characters of base62
      expect(ksuidPart.length).toBe(27);
      expect(ksuidPart).toMatch(/^[A-Za-z0-9]{27}$/);
    });

    test('should be deterministic in format but random in content', () => {
      const ids = Array.from({ length: 100 }, () => generateStrategyId());

      // All should have same format
      for (const id of ids) {
        expect(id).toMatch(/^stg_[A-Za-z0-9]{27}$/);
      }

      // All should be unique
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(100);
    });
  });

  describe('generateSessionId', () => {
    test('should generate ID with correct prefix', () => {
      const id = generateSessionId();
      expect(id).toMatch(/^ssn_/);
    });

    test('should generate ID with correct format', () => {
      const id = generateSessionId();
      // Should match: prefix + underscore + KSUID (27 characters)
      expect(id).toMatch(/^ssn_[A-Za-z0-9]{27}$/);
    });

    test('should generate unique IDs on multiple calls', () => {
      const id1 = generateSessionId();
      const id2 = generateSessionId();
      const id3 = generateSessionId();

      expect(id1).not.toBe(id2);
      expect(id2).not.toBe(id3);
      expect(id1).not.toBe(id3);
    });

    test('should generate IDs with correct total length', () => {
      const id = generateSessionId();
      // prefix (3) + underscore (1) + KSUID (27) = 31 characters
      expect(id.length).toBe(31);
    });

    test('should generate IDs that start with session prefix', () => {
      const ids = Array.from({ length: 10 }, () => generateSessionId());

      for (const id of ids) {
        expect(id.startsWith('ssn_')).toBe(true);
      }
    });

    test('should generate KSUID-compatible format', () => {
      const id = generateSessionId();
      const ksuidPart = id.substring(4); // Remove 'ssn_'

      // KSUID should be 27 characters of base62
      expect(ksuidPart.length).toBe(27);
      expect(ksuidPart).toMatch(/^[A-Za-z0-9]{27}$/);
    });

    test('should be deterministic in format but random in content', () => {
      const ids = Array.from({ length: 100 }, () => generateSessionId());

      // All should have same format
      for (const id of ids) {
        expect(id).toMatch(/^ssn_[A-Za-z0-9]{27}$/);
      }

      // All should be unique
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(100);
    });
  });

  describe('ID generation comparison', () => {
    test('should generate different formats for strategy vs session', () => {
      const strategyId = generateStrategyId();
      const sessionId = generateSessionId();

      expect(strategyId.startsWith('stg_')).toBe(true);
      expect(sessionId.startsWith('ssn_')).toBe(true);
      expect(strategyId).not.toBe(sessionId);
    });

    test('should maintain format consistency across generators', () => {
      const strategyIds = Array.from({ length: 10 }, () =>
        generateStrategyId()
      );
      const sessionIds = Array.from({ length: 10 }, () => generateSessionId());

      // All strategy IDs should have same prefix
      for (const id of strategyIds) {
        expect(id.startsWith('stg_')).toBe(true);
        expect(id.length).toBe(31);
      }

      // All session IDs should have same prefix
      for (const id of sessionIds) {
        expect(id.startsWith('ssn_')).toBe(true);
        expect(id.length).toBe(31);
      }

      // No overlap between the two sets
      const allIds = [...strategyIds, ...sessionIds];
      const uniqueIds = new Set(allIds);
      expect(uniqueIds.size).toBe(20);
    });
  });
});
