import * as z from 'zod/v4';
import { AppAssociationReferenceSchema } from '../app/schema.js';
import { SessionAssociationReferenceSchema } from '../authentication/sessions/schema.js';
import {
  PermissionAssociationReferenceSchema,
  RoleAssociationReferenceSchema,
} from '../authorization/index.js';
import {
  DeactivatedAtPropertyPayloadSchema,
  DeactivatedAtPropertySchema,
  DeletedAtPropertyPayloadSchema,
  DeletedAtPropertySchema,
  OptionalDatePayloadSchema,
  OptionalDateSchema,
  UpdatedAtPropertyPayloadSchema,
  UpdatedAtPropertySchema,
} from '../common/schema/dates.js';
import {
  MetadataMapPropertySchema,
  MetadataRecordPropertySchema,
  UpsertMetadataPropertySchema,
} from '../common/schema/metadata.js';
import { OrganizationAssociationReferenceSchema } from '../customer/organization/schema.js';
import { UserAssociationReferenceSchema } from '../customer/users/schema.js';

export const AssociationObjectType = {
  USER: 'User',
  ORGANIZATION: 'Organization',
  ROLE: 'Role',
  APP: 'App',
  PERMISSION: 'Permission',
  SESSION: 'Session',
} as const;
export type AnyAssociationObjectType =
  (typeof AssociationObjectType)[keyof typeof AssociationObjectType];

export const AssociationObjectSchema = z.union([
  UserAssociationReferenceSchema,
  OrganizationAssociationReferenceSchema,
  AppAssociationReferenceSchema,
  RoleAssociationReferenceSchema,
  PermissionAssociationReferenceSchema,
  SessionAssociationReferenceSchema,
]);
export type AssociationObject = z.output<typeof AssociationObjectSchema>;
// export type AssociationObject =
//   | UserAssociationReference
//   | OrganizationAssociationReference
//   | AppAssociationReference
//   | RoleAssociationReference
//   | PermissionAssociationReference;

export const ObjectPropertySchema = z.object({
  object: AssociationObjectSchema,
});

export const AssociationSchema = z.object({
  ...ObjectPropertySchema.shape,
  expiresAt: OptionalDateSchema,
  ...UpdatedAtPropertySchema.shape,
  ...DeletedAtPropertySchema.shape,
  ...DeactivatedAtPropertySchema.shape,
  ...MetadataMapPropertySchema.shape,
});
const RootAssociationProperties = AssociationSchema.omit({ object: true });
type RootAssociationProperties = z.input<typeof RootAssociationProperties>;
export type AssociationProperties<
  O extends AssociationObject = AssociationObject,
> = RootAssociationProperties & {
  object: O;
};
const RootAssociation = AssociationSchema.omit({ object: true });
type RootAssociation = z.output<typeof RootAssociation>;
export type Association<O extends AssociationObject = AssociationObject> =
  RootAssociation & {
    object: O;
  };

export const AssociationPayloadSchema = z.object({
  ...ObjectPropertySchema.shape,
  expiresAt: OptionalDatePayloadSchema,
  ...UpdatedAtPropertyPayloadSchema.shape,
  ...DeletedAtPropertyPayloadSchema.shape,
  ...DeactivatedAtPropertyPayloadSchema.shape,
  ...MetadataRecordPropertySchema.shape,
});
type RootAssociationPayload = z.output<typeof AssociationPayloadSchema>;

export type AssociationPayload<
  O extends AssociationObject = AssociationObject,
> = RootAssociationPayload & {
  object: O;
};

export const UpsertAssociationPayloadSchema = z.object({
  expiresAt: OptionalDatePayloadSchema,
  ...UpsertMetadataPropertySchema.shape,
});
export type UpsertAssociationInput = z.input<
  typeof UpsertAssociationPayloadSchema
>;
export type UpsertAssociationPayload = z.output<
  typeof UpsertAssociationPayloadSchema
>;
