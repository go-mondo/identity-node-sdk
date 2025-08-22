import { z } from 'zod';

/**
 * Value
 */
export const MetadataValueSchema = z.union([
  z.string(),
  z.number(),
  z.boolean(),
]);

/**
 * Record
 */
const MetadataRecordSchema = z.record(z.string(), MetadataValueSchema);
export type MetadataRecord = z.output<typeof MetadataRecordSchema>;

/**
 * Map
 */
const MetadataMapSchema = z.instanceof(
  Map<string, z.output<typeof MetadataValueSchema>>
);
export type MetadataMap = z.output<typeof MetadataMapSchema>;

/**
 * Record To Map transformation function
 */
function transformToMetadataMap(
  input:
    | z.output<typeof MetadataMapSchema>
    | z.output<typeof MetadataRecordSchema>
    | undefined
    | null
): Map<string, z.output<typeof MetadataValueSchema>> {
  if (input == null) {
    return new Map<string, z.output<typeof MetadataValueSchema>>();
  }
  if (input instanceof Map) {
    return new Map<string, z.output<typeof MetadataValueSchema>>(input);
  }
  return new Map(
    Object.entries(input || {}).map(([key, value]) => [key, value])
  );
}

export const MetadataPayloadSchema = z
  .union([z.undefined(), z.null(), MetadataMapSchema, MetadataRecordSchema])
  .transform((map) => (map ? buildMetadataPayload(map) : undefined))
  .refine((n) => !n || Object.keys(n).length <= 10, {
    message: 'Metadata must have 10 items or less',
  });
export type MetadataPayload = z.output<typeof MetadataPayloadSchema>;

export const MetadataPayloadPropertySchema = z.object({
  metadata: MetadataPayloadSchema.optional(),
});
export type MetadataPayloadProperty = z.output<
  typeof MetadataPayloadPropertySchema
>;

export const UpsertMetadataPayloadSchema = z
  .union([z.undefined(), z.null(), MetadataMapSchema, MetadataRecordSchema])
  .pipe(
    z.transform((map) => (map ? buildUpsertMetadataPayload(map) || null : map))
  )
  .refine((n) => !n || Object.keys(n).length <= 10, {
    message: 'Metadata must have 10 items or less',
  });
export type UpsertMetadataInput = z.input<typeof UpsertMetadataPayloadSchema>;
export type UpsertMetadataPayload = z.output<
  typeof UpsertMetadataPayloadSchema
>;

export const UpsertMetadataPropertyPayloadSchema = z.object({
  metadata: UpsertMetadataPayloadSchema.optional(),
});
export type UpsertMetadataPropertyInput = z.input<
  typeof UpsertMetadataPropertyPayloadSchema
>;
export type UpsertMetadataPropertyPayload = z.output<
  typeof UpsertMetadataPropertyPayloadSchema
>;

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

  return buildUpsertMetadataPayloadFromIterable(map.entries());
}

export function buildUpsertMetadataPayloadFromIterable(
  metadata: Iterable<[string, string | number | boolean]> | null
): MetadataRecord | null {
  if (metadata == null) {
    return null;
  }

  const result = Array.from(metadata).reduce((result, [key, value]) => {
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
const ToMetadataMapSchema = z
  .union([z.undefined(), z.null(), MetadataMapSchema, MetadataRecordSchema])
  .pipe(z.transform(transformToMetadataMap));

export const MetadataMapPropertySchema = z.object({
  metadata: ToMetadataMapSchema,
});
export type MetadataMapProperty = z.output<typeof MetadataMapPropertySchema>;

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
