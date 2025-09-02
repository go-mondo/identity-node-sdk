import * as z from 'zod/v4';

// Normalizing to a Date object
export const RequiredDateSchema = z.union([
  z.date(),
  z
    .string()
    .datetime()
    .transform((str) => new Date(str)),
]);
export const OptionalDateSchema = RequiredDateSchema.optional();

export type AnyRequiredDateType = z.input<typeof RequiredDateSchema>;
export type RequiredDate = z.output<typeof RequiredDateSchema>;

export type AnyOptionalDate = z.input<typeof OptionalDateSchema>;
export type OptionalDate = z.output<typeof OptionalDateSchema>;

// What the class property is serialized to
export const RequiredDatePayloadSchema = RequiredDateSchema.transform((d) =>
  d.toISOString()
);
export const OptionalDatePayloadSchema = OptionalDateSchema.transform((d) =>
  d?.toISOString()
).optional();

export type RequiredDatePayload = z.output<typeof RequiredDatePayloadSchema>;
export type OptionalDatePayload = z.output<typeof OptionalDatePayloadSchema>;

/**
 * Created At
 */
export const CreatedAtPropertyPayloadSchema = z.object({
  createdAt: RequiredDatePayloadSchema,
});
export type CreatedAtPropertyPayload = z.output<
  typeof CreatedAtPropertyPayloadSchema
>;
export const CreatedAtPropertySchema = z.object({
  createdAt: RequiredDateSchema,
});
export type CreatedAtProperty = z.output<typeof CreatedAtPropertySchema>;

/**
 * Updated At
 */
export const UpdatedAtPropertyPayloadSchema = z.object({
  updatedAt: RequiredDatePayloadSchema,
});
export type UpdatedAtPropertyPayload = z.output<
  typeof UpdatedAtPropertyPayloadSchema
>;
export const UpdatedAtPropertySchema = z.object({
  updatedAt: RequiredDateSchema,
});
export type UpdatedAtProperty = z.output<typeof UpdatedAtPropertySchema>;

/**
 * Deleted At
 */
export const DeletedAtPropertyPayloadSchema = z.object({
  deletedAt: OptionalDatePayloadSchema,
});
export type DeletedAtPropertyPayload = z.output<
  typeof DeletedAtPropertyPayloadSchema
>;
export const DeletedAtPropertySchema = z.object({
  deletedAt: OptionalDateSchema,
});
export type DeletedAtProperty = z.output<typeof DeletedAtPropertySchema>;

/**
 * Deactivated At
 */
export const DeactivatedAtPropertyPayloadSchema = z.object({
  deactivatedAt: OptionalDatePayloadSchema,
});
export type DeactivatedAtPropertyPayload = z.output<
  typeof DeactivatedAtPropertyPayloadSchema
>;
export const DeactivatedAtPropertySchema = z.object({
  deactivatedAt: OptionalDateSchema,
});
export type DeactivatedAtProperty = z.output<
  typeof DeactivatedAtPropertySchema
>;
