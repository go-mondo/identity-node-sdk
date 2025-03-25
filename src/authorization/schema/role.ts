import { type } from 'arktype';
import {
  OptionalDatePayloadSchema,
  RequiredDatePayloadSchema,
} from '../../common/index.js';
import { AggregateSchema } from '../../common/schema/aggregate.js';
import { MetadataPayloadPropertySchema } from '../../common/schema/metadata.js';
import { generateRoleId } from './utils.js';

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

export const RolePayloadSchema = RoleIdPropertySchema.and({
  name: type('string'),
  status: StatusSchema,
  description: type('string').optional(),
  apps: AggregateSchema.optional(),
  users: AggregateSchema.optional(),
  permissions: AggregateSchema.optional(),
  createdAt: RequiredDatePayloadSchema,
  updatedAt: RequiredDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
})
  .and(RoleIdPropertySchema)
  .and(MetadataPayloadPropertySchema);
export type RolePayload = typeof RolePayloadSchema.inferOut;

export const InsertRolePayloadSchema = type({
  id: RoleIdSchema.default(generateRoleId()),
  name: type('string'),
  status: StatusSchema.default(RoleStatus.ENABLED),
  description: type('string').optional(),
}).and(MetadataPayloadPropertySchema);
export type InsertRolePayload = typeof InsertRolePayloadSchema.inferOut;

export const UpdateRolePayloadSchema = type({
  name: type('string').optional(),
  status: StatusSchema.optional(),
  description: type('string').optional(),
}).and(MetadataPayloadPropertySchema);
export type UpdateRolePayload = typeof UpdateRolePayloadSchema.inferOut;

const AssociationSchema = type('string[] | undefined');

export const RoleAssociationsSchema = type({
  '+': 'delete',
  apps: AssociationSchema.optional(),
  permissions: AssociationSchema.optional(),
  users: AssociationSchema.optional(),
});
export type RoleAssociations = typeof RoleAssociationsSchema.inferOut;

export const RoleAssociationReferenceSchema = RolePayloadSchema.pick(
  'id',
  'name',
  'status'
).and({
  model: "'Role'",
});
export type RoleAssociationReference =
  typeof RoleAssociationReferenceSchema.inferOut;
