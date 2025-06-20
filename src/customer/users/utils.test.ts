import { describe, expect, test } from 'vitest';
import {
  getInitials,
  buildName,
  buildProperName,
  buildReference,
} from './utils.js';

describe('Customer Users - Utils', () => {
  describe('getInitials', () => {
    test('should return initials for single name', () => {
      expect(getInitials('John')).toBe('J');
    });

    test('should return initials for full name', () => {
      expect(getInitials('John Doe')).toBe('JD');
    });

    test('should return initials for multiple names', () => {
      expect(getInitials('John Michael Doe')).toBe('JMD');
    });

    test('should handle names with extra spaces', () => {
      expect(getInitials('John  Doe')).toBe('JD');
      expect(getInitials(' John Doe ')).toBe('JD');
    });

    test('should return undefined for empty string', () => {
      expect(getInitials('')).toBeUndefined();
    });

    test('should return undefined for undefined input', () => {
      expect(getInitials(undefined)).toBeUndefined();
    });

    test('should handle single character names', () => {
      expect(getInitials('A B C')).toBe('ABC');
    });

    test('should filter out empty parts', () => {
      expect(getInitials('John  Doe')).toBe('JD');
    });
  });

  describe('buildName', () => {
    test('should build name from givenName and familyName', () => {
      const item = { givenName: 'John', familyName: 'Doe' };
      expect(buildName(item)).toBe('John Doe');
    });

    test('should handle only givenName', () => {
      const item = { givenName: 'John' };
      expect(buildName(item)).toBe('John');
    });

    test('should handle only familyName', () => {
      const item = { familyName: 'Doe' };
      expect(buildName(item)).toBe('Doe');
    });

    test('should return empty string for empty object', () => {
      expect(buildName({})).toBe('');
    });

    test('should return empty string for undefined', () => {
      expect(buildName(undefined)).toBe('');
    });

    test('should filter out empty strings', () => {
      const item = { givenName: 'John', familyName: '' };
      expect(buildName(item)).toBe('John');
    });
  });

  describe('buildProperName', () => {
    test('should build proper name with all components', () => {
      const item = {
        honorificPrefix: 'Dr.',
        givenName: 'John',
        middleName: 'Michael',
        familyName: 'Doe',
        honorificSuffix: 'Jr.',
      };

      expect(buildProperName(item, true)).toBe('Dr. John Michael Doe Jr.');
    });

    test('should exclude middle name by default', () => {
      const item = {
        honorificPrefix: 'Dr.',
        givenName: 'John',
        middleName: 'Michael',
        familyName: 'Doe',
        honorificSuffix: 'Jr.',
      };

      expect(buildProperName(item)).toBe('Dr. John Doe Jr.');
    });

    test('should handle missing components', () => {
      const item = {
        givenName: 'John',
        familyName: 'Doe',
      };

      expect(buildProperName(item)).toBe('John Doe');
    });

    test('should handle only prefix and suffix', () => {
      const item = {
        honorificPrefix: 'Dr.',
        honorificSuffix: 'PhD',
      };

      expect(buildProperName(item)).toBe('Dr. PhD');
    });

    test('should return empty string for empty object', () => {
      expect(buildProperName({})).toBe('');
    });

    test('should return empty string for undefined', () => {
      expect(buildProperName(undefined)).toBe('');
    });

    test('should include middle name when explicitly requested', () => {
      const item = {
        givenName: 'John',
        middleName: 'Michael',
        familyName: 'Doe',
      };

      expect(buildProperName(item, true)).toBe('John Michael Doe');
      expect(buildProperName(item, false)).toBe('John Doe');
    });
  });

  describe('buildReference', () => {
    test('should prioritize name over email', () => {
      const item = {
        givenName: 'John',
        familyName: 'Doe',
        email: 'john@example.com',
      };

      expect(buildReference(item)).toBe('John Doe');
    });

    test('should fallback to email when no name', () => {
      const item = {
        email: 'john@example.com',
      };

      expect(buildReference(item)).toBe('john@example.com');
    });

    test('should return empty string when no name or email', () => {
      const item = {};
      expect(buildReference(item)).toBe('');
    });

    test('should return empty string for undefined', () => {
      expect(buildReference(undefined)).toBe('');
    });

    test('should use partial name if available', () => {
      const item = {
        givenName: 'John',
        email: 'john@example.com',
      };

      expect(buildReference(item)).toBe('John');
    });

    test('should prefer family name over email if no given name', () => {
      const item = {
        familyName: 'Doe',
        email: 'john@example.com',
      };

      expect(buildReference(item)).toBe('Doe');
    });
  });
});
