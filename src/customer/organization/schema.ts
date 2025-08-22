import { z } from 'zod';
import {
  OptionalDatePayloadSchema,
  RequiredDatePayloadSchema,
} from '../../common/index.js';
import {
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

const StatusSchema = z.enum([
  OrganizationStatus.ACTIVE,
  OrganizationStatus.SUSPENDED,
] as const);

export const OrganizationPayloadSchema = z.object({
  ...OrganizationIdPropertySchema.shape,
  status: StatusSchema.default(OrganizationStatus.ACTIVE),
  name: OrganizationNameSchema,
  createdAt: RequiredDatePayloadSchema,
  updatedAt: RequiredDatePayloadSchema,
  deletedAt: OptionalDatePayloadSchema.optional(),
  deactivatedAt: OptionalDatePayloadSchema.optional(),
  ...MetadataPayloadPropertySchema.shape,
});
export type OrganizationPayload = z.output<typeof OrganizationPayloadSchema>;

export const InsertOrganizationPayloadSchema = z.object({
  id: OrganizationIdSchema.default(() => generateOrganizationId()),
  status: StatusSchema.optional(),
  name: OrganizationNameSchema,
  ...UpsertMetadataPropertyPayloadSchema.shape,
});
export type InsertOrganizationPayload = z.output<
  typeof InsertOrganizationPayloadSchema
>;

export const UpdateOrganizationPayloadSchema = z.object({
  status: StatusSchema.or(z.null()).optional(),
  name: OrganizationNameSchema.or(z.null()).optional(),
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
