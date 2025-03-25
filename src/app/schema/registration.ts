import { type } from 'arktype';
import { OptionalDatePayloadSchema } from '../../common/schema/dates.js';
import { MetadataPayloadPropertySchema } from '../../common/schema/metadata.js';

const AllowSelfRegistrationSchema = type('boolean');

export const RegistrationPayloadSchema = type({
  allowSelfRegistration: AllowSelfRegistrationSchema.default(false),

  'updatedAt?': OptionalDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
}).and(MetadataPayloadPropertySchema);
export type RegistrationPayload = typeof RegistrationPayloadSchema.inferOut;

export const UpsertRegistrationPayloadSchema = type({
  allowSelfRegistration: AllowSelfRegistrationSchema.or('undefined').optional(),
}).and(MetadataPayloadPropertySchema);
export type UpsertRegistrationPayload =
  typeof UpsertRegistrationPayloadSchema.inferOut;
