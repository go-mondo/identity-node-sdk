import { type } from 'arktype';

// Normalizing to a Date object
export const RequiredDateSchema = type('Date').or('string.date.iso.parse');
export const OptionalDateSchema = RequiredDateSchema.or('undefined');

export type AnyRequiredDateType = typeof RequiredDateSchema.inferIn;
export type RequiredDate = typeof RequiredDateSchema.inferOut;

export type AnyOptionalDate = typeof OptionalDateSchema.inferIn;
export type OptionalDate = typeof OptionalDateSchema.inferOut;

// What the class property is serialized to
export const RequiredDatePayloadSchema = RequiredDateSchema.pipe.try((d) =>
  d.toISOString()
);
export const OptionalDatePayloadSchema = OptionalDateSchema.pipe.try((d) =>
  d?.toISOString()
);

export type RequiredDatePayload = typeof RequiredDatePayloadSchema.inferOut;
export type OptionalDatePayload = typeof OptionalDatePayloadSchema.inferOut;

/**
 * Created At
 */
export const CreatedAtPropertyPayloadSchema = type({
  createdAt: RequiredDatePayloadSchema,
});
export type CreatedAtPropertyPayload =
  typeof CreatedAtPropertyPayloadSchema.inferOut;

/**
 * Updated At
 */
export const UpdatedAtPropertyPayloadSchema = type({
  updatedAt: RequiredDatePayloadSchema,
});
export type UpdatedAtPropertyPayload =
  typeof UpdatedAtPropertyPayloadSchema.inferOut;

/**
 * Deleted At
 */
export const DeletedAtPropertyPayloadSchema = type({
  'deletedAt?': OptionalDatePayloadSchema,
});
export type DeletedAtPropertyPayload =
  typeof DeletedAtPropertyPayloadSchema.inferOut;

/**
 * Deactivated At
 */
export const DeactivatedAtPropertyPayloadSchema = type({
  'deactivatedAt?': OptionalDatePayloadSchema,
});
export type DeactivatedAtPropertyPayload =
  typeof DeactivatedAtPropertyPayloadSchema.inferOut;
