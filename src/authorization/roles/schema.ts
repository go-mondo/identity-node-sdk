import { z } from 'zod';
import { AppIdAssociationsSchema } from '../../app/schema.js';
import { AggregateSchema } from '../../common/schema/aggregate.js';
import {
  CreatedAtPropertyPayloadSchema,
  CreatedAtPropertySchema,
  DeactivatedAtPropertyPayloadSchema,
  DeactivatedAtPropertySchema,
  DeletedAtPropertyPayloadSchema,
  DeletedAtPropertySchema,
  UpdatedAtPropertyPayloadSchema,
  UpdatedAtPropertySchema,
} from '../../common/schema/dates.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
  UpsertMetadataPropertyPayloadSchema,
} from '../../common/schema/metadata.js';
import { UserIdAssociationsSchema } from '../../customer/schema.js';
import { PermissionIdAssociationsSchema, RoleIdSchema } from '../schema.js';

export const RoleStatus = {
  ENABLED: 'enabled',
  DISABLED: 'disabled',
} as const;

export type AnyRoleStatus = (typeof RoleStatus)[keyof typeof RoleStatus];

export const RoleIdPropertySchema = z.object({
  id: RoleIdSchema,
});
export type RoleIdProperty = z.output<typeof RoleIdPropertySchema>;

const StatusSchema = z.enum([RoleStatus.ENABLED, RoleStatus.DISABLED] as const);

export const RoleAssociationsSchema = z.object({
  apps: AppIdAssociationsSchema.optional(),
  permissions: PermissionIdAssociationsSchema.optional(),
  users: UserIdAssociationsSchema.optional(),
});
export type RoleAssociations = z.output<typeof RoleAssociationsSchema>;

const BaseSchema = z.object({
  ...RoleIdPropertySchema.shape,
  name: z.string(),
  status: StatusSchema,
  description: z.string().optional(),
  apps: AggregateSchema.optional(),
  users: AggregateSchema.optional(),
  permissions: AggregateSchema.optional(),
});

export const RoleSchema = z.object({
  ...BaseSchema.shape,
  ...CreatedAtPropertySchema.shape,
  ...UpdatedAtPropertySchema.shape,
  ...DeletedAtPropertySchema.shape,
  ...DeactivatedAtPropertySchema.shape,
  ...MetadataMapPropertySchema.shape,
});
export type RoleProperties = z.input<typeof RoleSchema>;
export type Role = z.output<typeof RoleSchema>;

export const RolePayloadSchema = z.object({
  ...BaseSchema.shape,
  ...CreatedAtPropertyPayloadSchema.shape,
  ...UpdatedAtPropertyPayloadSchema.shape,
  ...DeletedAtPropertyPayloadSchema.shape,
  ...DeactivatedAtPropertyPayloadSchema.shape,
  ...MetadataPayloadPropertySchema.shape,
});
export type RolePayload = z.output<typeof RolePayloadSchema>;

/**
 * Insert
 */
export const InsertRolePayloadSchema = z.object({
  id: RoleIdSchema.optional(),
  name: z.string(),
  status: StatusSchema.default(RoleStatus.ENABLED),
  description: z.string().optional(),
  ...RoleAssociationsSchema.shape,
  ...UpsertMetadataPropertyPayloadSchema.shape,
});
export type InsertRoleInput = z.input<typeof InsertRolePayloadSchema>;
export type InsertRolePayload = z.output<typeof InsertRolePayloadSchema>;

/**
 * Update
 */
export const UpdateRolePayloadSchema = z.object({
  name: z.string().optional(),
  status: StatusSchema.optional(),
  description: z.string().optional(),
  ...UpsertMetadataPropertyPayloadSchema.shape,
});
export type UpdateRoleInput = z.input<typeof UpdateRolePayloadSchema>;
export type UpdateRolePayload = z.output<typeof UpdateRolePayloadSchema>;

/**
 * Association
 */
export const RoleAssociationReferenceSchema = z.object({
  ...RoleIdPropertySchema.shape,
  name: z.string(),
  status: StatusSchema.default('disabled'),
  model: z.literal('Role'),
});
export type RoleAssociationReference = z.output<
  typeof RoleAssociationReferenceSchema
>;
