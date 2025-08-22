import { z } from 'zod';
import {
  OptionalDatePayloadSchema,
  OptionalDateSchema,
} from '../../common/schema/dates.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
  UpsertMetadataPropertyPayloadSchema,
} from '../../common/schema/metadata.js';

export const SAMLSchema = z.object({
  updatedAt: OptionalDateSchema.optional(),
  deletedAt: OptionalDateSchema.optional(),
  deactivatedAt: OptionalDateSchema.optional(),
  ...MetadataMapPropertySchema.shape,
});
export type SAMLProperties = z.input<typeof SAMLSchema>;
export type SAML = z.output<typeof SAMLSchema>;

export const SAMLPayloadSchema = z.object({
  updatedAt: OptionalDatePayloadSchema.optional(),
  deletedAt: OptionalDatePayloadSchema.optional(),
  deactivatedAt: OptionalDatePayloadSchema.optional(),
  ...MetadataPayloadPropertySchema.shape,
});
export type SAMLPayload = z.output<typeof SAMLPayloadSchema>;

export const InsertSAMLPayloadSchema = z.union([
  UpsertMetadataPropertyPayloadSchema,
  z.undefined(),
]);
export type InsertSAMLInput = z.input<typeof InsertSAMLPayloadSchema>;
export type InsertSAMLPayload = z.output<typeof InsertSAMLPayloadSchema>;

export const UpdateSAMLPayloadSchema = UpsertMetadataPropertyPayloadSchema;
export type UpdateSAMLInput = z.input<typeof InsertSAMLPayloadSchema>;
export type UpdateSAMLPayload = z.output<typeof InsertSAMLPayloadSchema>;
