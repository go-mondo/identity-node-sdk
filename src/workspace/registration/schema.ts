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
import {
  IdentityIdentifier,
  IdentityIdentifierSchema,
} from '../../identity/schema.js';

const IdentityIdentifierPropertySchema = z.array(
  z.object({
    type: IdentityIdentifierSchema,
  })
);

const AllowSelfRegistrationSchema = z.boolean();

const BaseSchema = z.object({
  allowSelfRegistration: AllowSelfRegistrationSchema.default(false),
  identifiers: IdentityIdentifierPropertySchema.default([
    {
      type: IdentityIdentifier.EMAIL,
    },
  ]),
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
  allowSelfRegistration: AllowSelfRegistrationSchema.optional(),
  identifiers: IdentityIdentifierPropertySchema.optional(),
  ...UpsertMetadataPropertySchema.shape,
});
export type UpsertRegistrationPayload = z.output<
  typeof UpsertRegistrationPayloadSchema
>;
