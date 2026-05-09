import * as z from 'zod/v4';
import {
  DeactivatedAtPropertyPayloadSchema,
  DeactivatedAtPropertySchema,
  DeletedAtPropertyPayloadSchema,
  DeletedAtPropertySchema,
  OptionalDatePayloadSchema,
  OptionalDateSchema,
} from '../../common/schema/dates.js';
import {
  MetadataMapPropertySchema,
  MetadataRecordPropertySchema,
  UpsertMetadataPropertySchema,
} from '../../common/schema/metadata.js';

const AllowSelfRegistrationSchema = z.boolean();

const BaseSchema = z.object({
  allowSelfRegistration: AllowSelfRegistrationSchema.default(false),
});

export const RegistrationSchema = z.object({
  ...BaseSchema.shape,
  updatedAt: OptionalDateSchema,
  ...DeletedAtPropertySchema.shape,
  ...DeactivatedAtPropertySchema.shape,
  ...MetadataMapPropertySchema.shape,
});
export type RegistrationProperties = z.input<typeof RegistrationSchema>;
export type Registration = z.output<typeof RegistrationSchema>;

export const RegistrationPayloadSchema = z.object({
  ...BaseSchema.shape,
  updatedAt: OptionalDatePayloadSchema,
  ...DeletedAtPropertyPayloadSchema.shape,
  ...DeactivatedAtPropertyPayloadSchema.shape,
  ...MetadataRecordPropertySchema.shape,
});
export type RegistrationPayload = z.output<typeof RegistrationPayloadSchema>;

export const UpsertRegistrationPayloadSchema = z.object({
  allowSelfRegistration: z
    .union([AllowSelfRegistrationSchema, z.undefined()])
    .optional(),
  ...UpsertMetadataPropertySchema.shape,
});
export type UpsertRegistrationInput = z.input<
  typeof UpsertRegistrationPayloadSchema
>;
export type UpsertRegistrationPayload = z.output<
  typeof UpsertRegistrationPayloadSchema
>;
