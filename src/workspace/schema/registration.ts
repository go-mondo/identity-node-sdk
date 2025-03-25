import { type } from 'arktype';
import { OptionalDatePayloadSchema } from '../../common/schema/dates.js';
import { MetadataPayloadPropertySchema } from '../../common/schema/metadata.js';
import { IdentityIdentifierSchema } from '../../identity/schema/schema.js';

const IdentityIdentifierPropertySchema = type({
  type: IdentityIdentifierSchema,
}).array();

const AllowSelfRegistrationSchema = type('boolean');

export const RegistrationPayloadSchema = type({
  allowSelfRegistration: AllowSelfRegistrationSchema,
  identifiers: IdentityIdentifierPropertySchema,

  'updatedAt?': OptionalDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
}).and(MetadataPayloadPropertySchema);
export type RegistrationPayload = typeof RegistrationPayloadSchema.inferOut;

export const UpsertRegistrationPayloadSchema = type({
  allowSelfRegistration: AllowSelfRegistrationSchema.optional(),
  identifiers: IdentityIdentifierPropertySchema.optional(),
}).and(MetadataPayloadPropertySchema);
export type UpsertRegistrationPayload =
  typeof UpsertRegistrationPayloadSchema.inferOut;
