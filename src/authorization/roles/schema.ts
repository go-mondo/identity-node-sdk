import { type } from 'arktype';
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
} from '../../common/schema/metadata.js';
import { generateRoleId } from '../utils.js';

export const RoleStatus = {
  ENABLED: 'enabled',
  DISABLED: 'disabled',
} as const;

export type AnyRoleStatus = (typeof RoleStatus)[keyof typeof RoleStatus];

const RoleIdSchema = type.string;

export const RoleIdPropertySchema = type({
  id: RoleIdSchema,
});
export type RoleIdProperty = typeof RoleIdPropertySchema.inferOut;

const StatusSchema = type.enumerated(RoleStatus.ENABLED, RoleStatus.DISABLED);

const AssociationSchema = type('string[] | undefined');

export const RoleAssociationsSchema = type({
  apps: AssociationSchema.optional(),
  permissions: AssociationSchema.optional(),
  users: AssociationSchema.optional(),
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
  .and(MetadataPayloadPropertySchema);
export type InsertRoleInput = typeof InsertRolePayloadSchema.inferIn;
export type InsertRolePayload = typeof InsertRolePayloadSchema.inferOut;

/**
 * Update
 */
export const UpdateRolePayloadSchema = type({
  name: type('string').optional(),
  status: StatusSchema.optional(),
  description: type('string').optional(),
}).and(MetadataPayloadPropertySchema);
export type UpdateRoleInput = typeof UpdateRolePayloadSchema.inferIn;
export type UpdateRolePayload = typeof UpdateRolePayloadSchema.inferOut;

/**
 * Association
 */
export const RoleAssociationReferenceSchema = RolePayloadSchema.pick(
  'id',
  'name',
  'status'
).and({
  model: "'Role'",
});
export type RoleAssociationReference =
  typeof RoleAssociationReferenceSchema.inferOut;
