import { type } from 'arktype';
import {
  OptionalDatePayloadSchema,
  RequiredDatePayloadSchema,
} from '../../common/schema/dates.js';
import { MetadataPayloadPropertySchema } from '../../common/schema/metadata.js';
import { OrganizationAssociationReferenceSchema } from '../../customer/schema/organization.js';
import { UserAssociationReferenceSchema } from '../../customer/schema/user.js';

export const AssociationIdReferenceSchema = type({
  id: type('string'),
});
export type AssociationIdReference =
  typeof AssociationIdReferenceSchema.inferOut;

export const AssociationAttributesReferenceSchema =
  AssociationIdReferenceSchema.and('Record<string, unknown>');
export type AssociationAttributesReference =
  typeof AssociationAttributesReferenceSchema.inferOut;

export type AssociationReference =
  | AssociationIdReference
  | AssociationAttributesReference;

export const AssociationObjectSchema = type.enumerated(
  UserAssociationReferenceSchema,
  OrganizationAssociationReferenceSchema
);
export type AssociationObject = typeof AssociationObjectSchema.inferOut;

export const ObjectPropertySchema = type({
  object: AssociationObjectSchema,
});

export const AssociationPayloadSchema = type({
  updatedAt: RequiredDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
})
  .and(ObjectPropertySchema)
  .and(MetadataPayloadPropertySchema);
export type AssociationPayload = typeof AssociationPayloadSchema.inferOut;

export const UpsertAssociationPayloadSchema = type({
  expiresAt: OptionalDatePayloadSchema.optional(),
}).and(MetadataPayloadPropertySchema);
export type UpsertAssociationPayload =
  typeof UpsertAssociationPayloadSchema.inferOut;
