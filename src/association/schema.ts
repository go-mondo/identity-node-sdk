import { type } from 'arktype';
import type { AppAssociationReference } from 'src/app/schema.js';
import type {
  PermissionAssociationReference,
  RoleAssociationReference,
} from 'src/authorization/index.js';
import {
  OptionalDatePayloadSchema,
  OptionalDateSchema,
  RequiredDatePayloadSchema,
  RequiredDateSchema,
} from '../common/schema/dates.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
} from '../common/schema/metadata.js';
import {
  type OrganizationAssociationReference,
  OrganizationAssociationReferenceSchema,
} from '../customer/schema/organization.js';
import {
  type UserAssociationReference,
  UserAssociationReferenceSchema,
} from '../customer/users/schema.js';

export const AssociationObjectType = {
  USER: 'User',
  ORGANIZATION: 'Organization',
  ROLE: 'Role',
  APP: 'App',
  PERMISSION: 'Permission',
} as const;
export type AnyAssociationObjectType =
  (typeof AssociationObjectType)[keyof typeof AssociationObjectType];

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
export type AssociationObject =
  | UserAssociationReference
  | OrganizationAssociationReference
  | AppAssociationReference
  | RoleAssociationReference
  | PermissionAssociationReference;

export const ObjectPropertySchema = type({
  object: AssociationObjectSchema,
});

export const AssociationSchema = ObjectPropertySchema.and({
  expiresAt: RequiredDateSchema,
  createdAt: RequiredDateSchema,
  updatedAt: RequiredDateSchema,
  deletedAt: OptionalDateSchema.optional(),
  deactivatedAt: OptionalDateSchema.optional(),
}).and(MetadataMapPropertySchema);
const RootAssociationProperties = AssociationSchema.omit('object');
type RootAssociationProperties = typeof RootAssociationProperties.inferIn;
export type AssociationProperties<
  O extends AssociationObject = AssociationObject,
> = RootAssociationProperties & {
  object: O;
};
const RootAssociation = AssociationSchema.omit('object');
type RootAssociation = typeof RootAssociation.inferOut;
export type Association<O extends AssociationObject = AssociationObject> =
  RootAssociation & {
    object: O;
  };

export const AssociationPayloadSchema = type({
  updatedAt: RequiredDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
})
  .and(ObjectPropertySchema)
  .and(MetadataPayloadPropertySchema);
type RootAssociationPayload = typeof AssociationPayloadSchema.inferOut;

export type AssociationPayload<
  O extends AssociationObject = AssociationObject,
> = RootAssociationPayload & {
  object: O;
};

export const UpsertAssociationPayloadSchema = type({
  expiresAt: OptionalDatePayloadSchema.optional(),
}).and(MetadataPayloadPropertySchema);
export type UpsertAssociationInput =
  typeof UpsertAssociationPayloadSchema.inferIn;
export type UpsertAssociationPayload =
  typeof UpsertAssociationPayloadSchema.inferOut;
