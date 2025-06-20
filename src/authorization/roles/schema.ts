import { type } from 'arktype';
import { AppIdAssociationsSchema } from '../../app/schema.js';
import {
  OptionalDatePayloadSchema,
  OptionalDateSchema,
  RequiredDatePayloadSchema,
  RequiredDateSchema,
} from '../../common/index.js';
import { AggregateSchema } from '../../common/schema/aggregate.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
  UpsertMetadataPropertyPayloadSchema,
} from '../../common/schema/metadata.js';
import { UserIdAssociationsSchema } from '../../customer/schema.js';
import {
  PermissionIdAssociationsSchema,
  RoleIdSchema,
  generateRoleId,
} from '../schema.js';

export const RoleStatus = {
  ENABLED: 'enabled',
  DISABLED: 'disabled',
} as const;

export type AnyRoleStatus = (typeof RoleStatus)[keyof typeof RoleStatus];

export const RoleIdPropertySchema = type({
  id: RoleIdSchema,
});
export type RoleIdProperty = typeof RoleIdPropertySchema.inferOut;

const StatusSchema = type.enumerated(RoleStatus.ENABLED, RoleStatus.DISABLED);

export const RoleAssociationsSchema = type({
  apps: AppIdAssociationsSchema.optional(),
  permissions: PermissionIdAssociationsSchema.optional(),
  users: UserIdAssociationsSchema.optional(),
});
export type RoleAssociations = typeof RoleAssociationsSchema.inferOut;

const BaseSchema = RoleIdPropertySchema.and({
  name: type('string'),
  status: StatusSchema,
  description: type('string').optional(),
  apps: AggregateSchema.optional(),
  users: AggregateSchema.optional(),
  permissions: AggregateSchema.optional(),
});

export const RoleSchema = BaseSchema.and({
  createdAt: RequiredDateSchema,
  updatedAt: RequiredDateSchema,
  'deletedAt?': OptionalDateSchema,
  'deactivatedAt?': OptionalDateSchema,
})
  .and(RoleIdPropertySchema)
  .and(MetadataMapPropertySchema);
export type RoleProperties = typeof RoleSchema.inferIn;
export type Role = typeof RoleSchema.inferOut;

export const RolePayloadSchema = BaseSchema.and({
  createdAt: RequiredDatePayloadSchema,
  updatedAt: RequiredDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
})
  .and(RoleIdPropertySchema)
  .and(MetadataPayloadPropertySchema);
export type RolePayload = typeof RolePayloadSchema.inferOut;

/**
 * Insert
 */
export const InsertRolePayloadSchema = type({
  id: RoleIdSchema.default(() => generateRoleId()),
  name: type('string'),
  status: StatusSchema.default(RoleStatus.ENABLED),
  description: type('string').optional(),
})
  .and(RoleAssociationsSchema)
  .and(UpsertMetadataPropertyPayloadSchema);
export type InsertRoleInput = typeof InsertRolePayloadSchema.inferIn;
export type InsertRolePayload = typeof InsertRolePayloadSchema.inferOut;

/**
 * Update
 */
export const UpdateRolePayloadSchema = type({
  name: type('string').optional(),
  status: StatusSchema.optional(),
  description: type('string').optional(),
}).and(UpsertMetadataPropertyPayloadSchema);
export type UpdateRoleInput = typeof UpdateRolePayloadSchema.inferIn;
export type UpdateRolePayload = typeof UpdateRolePayloadSchema.inferOut;

/**
 * Association
 */
export const RoleAssociationReferenceSchema = RoleIdPropertySchema.and({
  name: type('string'),
  status: StatusSchema.default('disabled'),
  model: "'Role'",
});
export type RoleAssociationReference =
  typeof RoleAssociationReferenceSchema.inferOut;
