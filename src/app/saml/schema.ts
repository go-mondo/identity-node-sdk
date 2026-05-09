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

export const SAMLSchema = z.object({
  updatedAt: OptionalDateSchema,
  ...DeletedAtPropertySchema.shape,
  ...DeactivatedAtPropertySchema.shape,
  ...MetadataMapPropertySchema.shape,
});
export type SAMLProperties = z.input<typeof SAMLSchema>;
export type SAML = z.output<typeof SAMLSchema>;

export const SAMLPayloadSchema = z.object({
  updatedAt: OptionalDatePayloadSchema,
  ...DeletedAtPropertyPayloadSchema.shape,
  ...DeactivatedAtPropertyPayloadSchema.shape,
  ...MetadataRecordPropertySchema.shape,
});
export type SAMLPayload = z.output<typeof SAMLPayloadSchema>;

export const InsertSAMLPayloadSchema = z.object({
  ...UpsertMetadataPropertySchema.shape,
});
export type InsertSAMLInput = z.input<typeof InsertSAMLPayloadSchema>;
export type InsertSAMLPayload = z.output<typeof InsertSAMLPayloadSchema>;

export const UpdateSAMLPayloadSchema = UpsertMetadataPropertySchema;
export type UpdateSAMLInput = z.input<typeof InsertSAMLPayloadSchema>;
export type UpdateSAMLPayload = z.output<typeof InsertSAMLPayloadSchema>;
