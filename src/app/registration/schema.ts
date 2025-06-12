import { type } from 'arktype';
import {
  OptionalDatePayloadSchema,
  OptionalDateSchema,
} from '../../common/schema/dates.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
} from '../../common/schema/metadata.js';

const AllowSelfRegistrationSchema = type('boolean');

const BaseSchema = type({
  allowSelfRegistration: AllowSelfRegistrationSchema.default(false),
});

export const RegistrationSchema = BaseSchema.and({
  'updatedAt?': OptionalDateSchema,
  'deletedAt?': OptionalDateSchema,
  'deactivatedAt?': OptionalDateSchema,
}).and(MetadataMapPropertySchema);
export type RegistrationProperties = typeof RegistrationSchema.inferIn;
export type Registration = typeof RegistrationSchema.inferOut;

export const RegistrationPayloadSchema = BaseSchema.and({
  'updatedAt?': OptionalDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
}).and(MetadataPayloadPropertySchema);
export type RegistrationPayload = typeof RegistrationPayloadSchema.inferOut;

export const UpsertRegistrationPayloadSchema = type({
  allowSelfRegistration: AllowSelfRegistrationSchema.or('undefined').optional(),
}).and(MetadataPayloadPropertySchema);
export type UpsertRegistrationInput =
  typeof UpsertRegistrationPayloadSchema.inferIn;
export type UpsertRegistrationPayload =
  typeof UpsertRegistrationPayloadSchema.inferOut;
