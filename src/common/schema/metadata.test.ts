import { type } from 'arktype';
import { describe, expect, test } from 'vitest';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
  UpsertMetadataPayloadSchema,
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

  describe('Upsert Metadata Payload Schema', () => {
    test('should handle incoming record', async () => {
      const result = UpsertMetadataPayloadSchema({
        foo: 'bar',
        bar: 'baz',
      }) as typeof UpsertMetadataPayloadSchema.inferOut;

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result?.foo).to.equal('bar');
      expect(result?.bar).to.equal('baz');
    });

    test('should handle incoming map', async () => {
      const result = UpsertMetadataPayloadSchema(
        new Map([
          ['foo', 'bar'],
          ['bar', 'baz'],
        ])
      ) as typeof UpsertMetadataPayloadSchema.inferOut;

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result?.foo).to.equal('bar');
      expect(result?.bar).to.equal('baz');
    });

    test('should only allow 10 items', async () => {
      const result = UpsertMetadataPayloadSchema(
        new Map([
          ['1', '1'],
          ['2', '2'],
          ['3', '3'],
          ['4', '4'],
          ['5', '5'],
          ['6', '6'],
          ['7', '7'],
          ['8', '8'],
          ['9', '9'],
          ['10', '10'],
          ['11', '11'],
        ])
      ) as typeof UpsertMetadataPayloadSchema.inferOut;

      expect(result).toBeInstanceOf(type.errors);
    });
  });

  describe('Map Property Schema', () => {
    test('should parse map to record', async () => {
      const result = MetadataMapPropertySchema({
        metadata: {
          foo: 'bar',
          bar: 'baz',
        },
      }) as typeof MetadataMapPropertySchema.inferOut;

      expect(result).not.toBeInstanceOf(type.errors);
      expect(result?.metadata?.get('foo')).to.equal('bar');
      expect(result?.metadata?.get('bar')).to.equal('baz');
    });
  });
});
