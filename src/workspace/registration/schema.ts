import { z } from 'zod';
import { OptionalDatePayloadSchema } from '../../common/schema/dates.js';
import { MetadataPayloadPropertySchema } from '../../common/schema/metadata.js';
import { IdentityIdentifierSchema } from '../../identity/schema.js';

const IdentityIdentifierPropertySchema = z.array(
  z.object({
    type: IdentityIdentifierSchema,
  })
);

const AllowSelfRegistrationSchema = z.boolean();

export const RegistrationPayloadSchema = z.object({
  allowSelfRegistration: AllowSelfRegistrationSchema,
  identifiers: IdentityIdentifierPropertySchema,

  updatedAt: OptionalDatePayloadSchema.optional(),
  deletedAt: OptionalDatePayloadSchema.optional(),
  deactivatedAt: OptionalDatePayloadSchema.optional(),
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
