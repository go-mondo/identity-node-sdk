import { z } from 'zod';
import {
  OptionalDatePayloadSchema,
  OptionalDateSchema,
} from '../../common/schema/dates.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
} from '../../common/schema/metadata.js';
import { IdentityIdentifierSchema } from '../../identity/schema.js';

const IdentityIdentifierPropertySchema = z.array(
  z.object({
    type: IdentityIdentifierSchema,
  })
);

const AllowSelfRegistrationSchema = z.boolean();

const BaseSchema = z.object({
  allowSelfRegistration: AllowSelfRegistrationSchema,
  identifiers: IdentityIdentifierPropertySchema,
});

export const RegistrationSchema = z.object({
  ...BaseSchema.shape,
  updatedAt: OptionalDateSchema,
  deletedAt: OptionalDateSchema,
  deactivatedAt: OptionalDateSchema,
  ...MetadataMapPropertySchema.shape,
});
export type RegistrationProperties = z.input<typeof RegistrationSchema>;
export type Registration = z.output<typeof RegistrationSchema>;

export const RegistrationPayloadSchema = z.object({
  ...BaseSchema.shape,
  updatedAt: OptionalDatePayloadSchema,
  deletedAt: OptionalDatePayloadSchema,
  deactivatedAt: OptionalDatePayloadSchema,
  ...MetadataPayloadPropertySchema.shape,
});
export type RegistrationPayload = z.output<typeof RegistrationPayloadSchema>;

export const UpsertRegistrationPayloadSchema = z.object({
  allowSelfRegistration: AllowSelfRegistrationSchema.optional(),
  identifiers: IdentityIdentifierPropertySchema.optional(),
  ...MetadataPayloadPropertySchema.shape,
});
export type UpsertRegistrationPayload = z.output<
  typeof UpsertRegistrationPayloadSchema
>;
