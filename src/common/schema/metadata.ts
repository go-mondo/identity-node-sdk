import { match, type } from 'arktype';

/**
 * Value
 */
const MetadataValueSchema = type('string | number | boolean');

/**
 * Record
 */
const MetadataRecordSchema = type({ '[string]': MetadataValueSchema });
export type MetadataRecord = typeof MetadataRecordSchema.inferOut;

/**
 * Map
 */
const MetadataMapSchema = type.instanceOf(
  Map<string, typeof MetadataValueSchema.inferOut>
);
export type MetadataMap = typeof MetadataMapSchema.inferOut;

/**
 * Record To Map
 */
const MetadataMapMatch = match({
  undefined: () => new Map<string, typeof MetadataValueSchema.inferOut>(),
})
  .case(
    MetadataMapSchema,
    (s: typeof MetadataMapSchema.inferOut) =>
      new Map<string, typeof MetadataValueSchema.inferOut>(s)
  )
  .case(
    MetadataMapSchema,
    (s: typeof MetadataMapSchema.inferOut) =>
      new Map(Object.entries(s || {}).map(([key, value]) => [key, value]))
  )
  .default(() => new Map<string, typeof MetadataValueSchema.inferOut>());

export const MetadataPayloadSchema = type('undefined | null')
  .or(MetadataMapSchema)
  .or(MetadataRecordSchema)
  .pipe((map) => (map ? buildMetadataPayload(map) : undefined));
export type MetadataPayload = typeof MetadataPayloadSchema.inferOut;

export const MetadataPayloadPropertySchema = type({
  'metadata?': MetadataPayloadSchema,
});
export type MetadataPayloadProperty =
  typeof MetadataPayloadPropertySchema.inferOut;

export const UpsertMetadataPayloadSchema = type('undefined | null')
  .or(MetadataMapSchema)
  .or(MetadataRecordSchema)
  .pipe((map) => (map ? buildUpsertMetadataPayload(map) || null : null));
export type UpsertMetadataInput = typeof UpsertMetadataPayloadSchema.inferIn;
export type UpsertMetadataPayload = typeof UpsertMetadataPayloadSchema.inferOut;

export const UpsertMetadataPayloadPropertySchema = type({
  'metadata?': UpsertMetadataPayloadSchema,
});
export type UpsertMetadataPayloadProperty =
  typeof UpsertMetadataPayloadPropertySchema.inferOut;

export function buildMetadataPayload(
  map: MetadataMap | MetadataRecord
): MetadataRecord | undefined {
  if (!(map instanceof Map)) {
    return map;
  }

  const result = Array.from(map.entries()).reduce((result, [key, value]) => {
    if (value == null || value === '') {
      return result;
    }

    Object.assign(result, { [key]: value });

    return result;
  }, {} as MetadataRecord);

  return Object.keys(result).length ? result : undefined;
}

export function buildUpsertMetadataPayload(
  map: MetadataMap | MetadataRecord
): MetadataRecord | null {
  if (!(map instanceof Map)) {
    return map;
  }

  const result = Array.from(map.entries()).reduce((result, [key, value]) => {
    if (value == null || value === '') {
      return result;
    }

    Object.assign(result, { [key]: value });

    return result;
  }, {} as MetadataRecord);

  return Object.keys(result).length ? result : null;
}

/**
 * Map
 */
const ToMetadataMapSchema = MetadataMapMatch.default(
  () => new Map<string, typeof MetadataValueSchema.inferOut>()
);
export const MetadataMapPropertySchema = type({
  metadata: ToMetadataMapSchema,
});
export type MetadataMapProperty = typeof MetadataMapPropertySchema.inferOut;

// export const metadataAttributeScope = scope({
//   metadata: MetadataAttributeMatch.default(
//     () => new Map<string, typeof MetadataAttributeValueSchema.inferOut>(),
//   ),
// });

// export const metadataPropertyScope = scope({
//   'metadata?': MetadataPropertyItemSchema,
// });

// export const serializedMetadataScope = scope({
//   metadata: SerializedMetadataSchema,
// });

// export const storageMetadataScope = scope({
//   metadata: StorageMetadataSchema,
// });
