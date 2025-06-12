import { type } from 'arktype';
import {
  OptionalDatePayloadSchema,
  OptionalDateSchema,
} from '../../common/schema/dates.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
} from '../../common/schema/metadata.js';

export const SAMLSchema = type({
  'updatedAt?': OptionalDateSchema,
  'deletedAt?': OptionalDateSchema,
  'deactivatedAt?': OptionalDateSchema,
}).and(MetadataMapPropertySchema);
export type SAMLProperties = typeof SAMLSchema.inferIn;
export type SAML = typeof SAMLSchema.inferOut;

export const SAMLPayloadSchema = type({
  'updatedAt?': OptionalDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
}).and(MetadataPayloadPropertySchema);
export type SAMLPayload = typeof SAMLPayloadSchema.inferOut;

export const InsertSAMLPayloadSchema =
  MetadataPayloadPropertySchema.or('undefined');
export type InsertSAMLInput = typeof InsertSAMLPayloadSchema.inferIn;
export type InsertSAMLPayload = typeof InsertSAMLPayloadSchema.inferOut;

export const UpdateSAMLPayloadSchema = MetadataPayloadPropertySchema;
export type UpdateSAMLInput = typeof InsertSAMLPayloadSchema.inferIn;
export type UpdateSAMLPayload = typeof InsertSAMLPayloadSchema.inferOut;
