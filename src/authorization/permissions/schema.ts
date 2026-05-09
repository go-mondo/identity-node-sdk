import * as z from 'zod/v4';
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
  MetadataRecordPropertySchema,
  UpsertMetadataPropertySchema,
} from '../../common/schema/metadata.js';
import { PermissionIdSchema, RoleIdAssociationsSchema } from '../schema.js';

export const PermissionStatus = {
  ENABLED: 'enabled',
  DISABLED: 'disabled',
} as const;

export type AnyPermissionStatus =
  (typeof PermissionStatus)[keyof typeof PermissionStatus];

export const PermissionIdPropertySchema = z.object({
  id: PermissionIdSchema,
});
export type PermissionIdProperty = z.output<typeof PermissionIdPropertySchema>;

const PermissionStatusSchema = z.enum([
  PermissionStatus.ENABLED,
  PermissionStatus.DISABLED,
] as const);

export const PermissionAssociationsSchema = z.object({
  apps: AppIdAssociationsSchema.optional(),
  roles: RoleIdAssociationsSchema.optional(),
});
export type PermissionAssociations = z.output<
  typeof PermissionAssociationsSchema
>;

const BaseSchema = z.object({
  ...PermissionIdPropertySchema.shape,
  name: z.string(),
  status: PermissionStatusSchema,
  description: z.string().optional(),
  apps: AggregateSchema.optional(),
  roles: AggregateSchema.optional(),
});

export const PermissionSchema = z.object({
  ...BaseSchema.shape,
  ...CreatedAtPropertySchema.shape,
  ...UpdatedAtPropertySchema.shape,
  ...DeletedAtPropertySchema.shape,
  ...DeactivatedAtPropertySchema.shape,
  ...MetadataMapPropertySchema.shape,
});
export type PermissionProperties = z.input<typeof PermissionSchema>;
export type Permission = z.output<typeof PermissionSchema>;

export const PermissionPayloadSchema = z.object({
  ...BaseSchema.shape,
  ...CreatedAtPropertyPayloadSchema.shape,
  ...UpdatedAtPropertyPayloadSchema.shape,
  ...DeletedAtPropertyPayloadSchema.shape,
  ...DeactivatedAtPropertyPayloadSchema.shape,
  ...MetadataRecordPropertySchema.shape,
});
export type PermissionPayload = z.output<typeof PermissionPayloadSchema>;

/**
 * Insert
 */
export const InsertPermissionPayloadSchema = z.object({
  id: PermissionIdSchema.optional(),
  name: z.string(),
  status: PermissionStatusSchema.default(PermissionStatus.ENABLED),
  description: z.string().optional(),
  ...PermissionAssociationsSchema.shape,
  ...UpsertMetadataPropertySchema.shape,
});
export type InsertPermissionInput = z.input<
  typeof InsertPermissionPayloadSchema
>;
export type InsertPermissionPayload = z.output<
  typeof InsertPermissionPayloadSchema
>;

/**
 * Update
 */
export const UpdatePermissionPayloadSchema = z.object({
  name: z.string().optional(),
  status: PermissionStatusSchema.optional(),
  description: z.string().optional(),
  ...UpsertMetadataPropertySchema.shape,
});
export type UpdatePermissionInput = z.input<
  typeof UpdatePermissionPayloadSchema
>;
export type UpdatePermissionPayload = z.output<
  typeof UpdatePermissionPayloadSchema
>;

/**
 * Association
 */

export const PermissionAssociationReferenceSchema = z.object({
  ...PermissionIdPropertySchema.shape,
  name: z.string(),
  status: PermissionStatusSchema.default('disabled'),
  model: z.literal('Permission'),
});
export type PermissionAssociationReference = z.output<
  typeof PermissionAssociationReferenceSchema
>;
