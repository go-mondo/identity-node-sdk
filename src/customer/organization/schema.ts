import { z } from 'zod';
import {
  OptionalDatePayloadSchema,
  OptionalDateSchema,
  RequiredDatePayloadSchema,
  RequiredDateSchema,
} from '../../common/index.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
  UpsertMetadataPropertyPayloadSchema,
} from '../../common/schema/metadata.js';
import { OrganizationIdSchema, generateOrganizationId } from '../schema.js';

export const OrganizationStatus = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
} as const;
export type AnyOrganizationStatus =
  (typeof OrganizationStatus)[keyof typeof OrganizationStatus];

export const OrganizationIdPropertySchema = z.object({
  id: OrganizationIdSchema,
});
export type OrganizationIdProperty = z.output<
  typeof OrganizationIdPropertySchema
>;

const OrganizationNameSchema = z.string();

const OrganizationStatusSchema = z.enum([
  OrganizationStatus.ACTIVE,
  OrganizationStatus.SUSPENDED,
] as const);

const BaseSchema = z.object({
  ...OrganizationIdPropertySchema.shape,
  name: OrganizationNameSchema,
  status: OrganizationStatusSchema,
});

export const OrganizationSchema = z.object({
  ...BaseSchema.shape,
  createdAt: RequiredDateSchema,
  updatedAt: RequiredDateSchema,
  deletedAt: OptionalDateSchema,
  deactivatedAt: OptionalDateSchema,
  ...MetadataMapPropertySchema.shape,
});
export type OrganizationProperties = z.input<typeof OrganizationSchema>;
export type Organization = z.output<typeof OrganizationSchema>;

export const OrganizationPayloadSchema = z.object({
  ...BaseSchema.shape,
  createdAt: RequiredDatePayloadSchema,
  updatedAt: RequiredDatePayloadSchema,
  deletedAt: OptionalDatePayloadSchema,
  deactivatedAt: OptionalDatePayloadSchema,
  ...MetadataPayloadPropertySchema.shape,
});
export type OrganizationPayload = z.output<typeof OrganizationPayloadSchema>;

export const InsertOrganizationPayloadSchema = z.object({
  id: OrganizationIdSchema.default(() => generateOrganizationId()),
  status: OrganizationStatusSchema.optional(),
  name: OrganizationNameSchema,
  ...UpsertMetadataPropertyPayloadSchema.shape,
});
export type InsertOrganizationPayload = z.output<
  typeof InsertOrganizationPayloadSchema
>;

export const UpdateOrganizationPayloadSchema = z.object({
  status: OrganizationStatusSchema.optional(),
  name: OrganizationNameSchema.optional(),
  ...UpsertMetadataPropertyPayloadSchema.shape,
});
export type UpdateOrganizationPayload = z.output<
  typeof UpdateOrganizationPayloadSchema
>;

/**
 * Association
 */
export const OrganizationAssociationReferenceSchema = z.object({
  ...OrganizationIdPropertySchema.shape,
  name: z.string(),
  model: z.literal('Organization'),
});
export type OrganizationAssociationReference = z.output<
  typeof OrganizationAssociationReferenceSchema
>;
