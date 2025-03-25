import { type } from 'arktype';
import {
  OptionalDatePayloadSchema,
  RequiredDatePayloadSchema,
} from '../../common/index.js';
import {
  MetadataPayloadPropertySchema,
  UpsertMetadataPayloadPropertySchema,
} from '../../common/schema/metadata.js';
import { generateOrganizationId } from './utils.js';

export const OrganizationStatus = {
  ACTIVE: 'active',
  SUSPENDED: 'suspended',
} as const;
export type AnyOrganizationStatus =
  (typeof OrganizationStatus)[keyof typeof OrganizationStatus];

export const OrganizationIdSchema = type.string;
export type OrganizationId = typeof OrganizationIdSchema.inferOut;

export const OrganizationIdPropertySchema = type({
  id: OrganizationIdSchema,
});
export type OrganizationIdProperty =
  typeof OrganizationIdPropertySchema.inferOut;

const OrganizationNameSchema = type.string;

const StatusSchema = type.enumerated(
  OrganizationStatus.ACTIVE,
  OrganizationStatus.SUSPENDED
);

export const OrganizationPayloadSchema = type({
  status: StatusSchema.default(OrganizationStatus.ACTIVE),
  name: OrganizationNameSchema,
  createdAt: RequiredDatePayloadSchema,
  updatedAt: RequiredDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
})
  .and(OrganizationIdPropertySchema)
  .and(MetadataPayloadPropertySchema);
export type OrganizationPayload = typeof OrganizationPayloadSchema.inferOut;

export const InsertOrganizationPayloadSchema = type({
  id: OrganizationIdSchema.default(generateOrganizationId()),
  status: StatusSchema.optional(),
  name: OrganizationNameSchema,
}).and(UpsertMetadataPayloadPropertySchema);
export type InsertOrganizationPayload =
  typeof InsertOrganizationPayloadSchema.inferOut;

export const UpdateOrganizationPayloadSchema = type({
  status: StatusSchema.or(type.null).optional(),
  name: OrganizationNameSchema.or(type.null).optional(),
}).and(UpsertMetadataPayloadPropertySchema);
export type UpdateOrganizationPayload =
  typeof UpdateOrganizationPayloadSchema.inferOut;

export const OrganizationAssociationReferenceSchema =
  OrganizationIdPropertySchema.and(
    type({
      name: type.string,
      model: "'Organization'",
    })
  );
export type OrganizationAssociationReference =
  typeof OrganizationAssociationReferenceSchema.inferOut;
