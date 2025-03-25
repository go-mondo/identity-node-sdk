import { type } from 'arktype';
import { describe, expect, test } from 'vitest';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
} from './metadata.js';

describe('Common - Metadata', () => {
  describe('Map Property Schema', () => {
    test('should parse a record to a map', async () => {
      const result = MetadataMapPropertySchema({
        metadata: { foo: 'bar' },
      }) as typeof MetadataMapPropertySchema.inferOut;

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result?.metadata).toBeInstanceOf(Map);
    });

    test('should parse undefined property to a map', async () => {
      const result = MetadataMapPropertySchema({
        metadata: undefined,
      }) as typeof MetadataMapPropertySchema.inferOut;

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result?.metadata).toBeInstanceOf(Map);
    });

    test('should parse undefined to a map', async () => {
      const result = MetadataMapPropertySchema(
        {}
      ) as typeof MetadataMapPropertySchema.inferOut;

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result?.metadata).toBeInstanceOf(Map);
    });

    test('should parse map to a map', async () => {
      const result = MetadataMapPropertySchema({
        metadata: new Map([['foo', 'bar']]),
      }) as typeof MetadataMapPropertySchema.inferOut;

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result?.metadata).toBeInstanceOf(Map);
    });

    test('should parse null to a map', async () => {
      const result = MetadataMapPropertySchema({
        metadata: null,
      }) as typeof MetadataMapPropertySchema.inferOut;

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result?.metadata).toBeInstanceOf(Map);
    });
  });

  describe('Payload', () => {
    test('should parse map to record', async () => {
      const result = MetadataPayloadPropertySchema({
        metadata: new Map<string, string | number>([
          ['foo', 'bar'],
          ['baz', 0],
        ]),
      }) as typeof MetadataPayloadPropertySchema.inferOut;

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result?.metadata?.foo).to.equal('bar');
      expect(result?.metadata?.baz).to.equal(0);
    });

    test('should return undefined if map is empty', async () => {
      const result = MetadataPayloadPropertySchema({
        metadata: new Map(),
      }) as typeof MetadataPayloadPropertySchema.inferOut;

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result?.metadata).is.undefined;
    });
  });
});
