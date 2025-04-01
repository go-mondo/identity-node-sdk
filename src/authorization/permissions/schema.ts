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
import { generatePermissionId } from '../utils.js';

export const PermissionStatus = {
  ENABLED: 'enabled',
  DISABLED: 'disabled',
} as const;

export type AnyPermissionStatus =
  (typeof PermissionStatus)[keyof typeof PermissionStatus];

export const PermissionIdSchema = type.string;

export const PermissionIdPropertySchema = type({
  id: PermissionIdSchema,
});
export type PermissionIdProperty = typeof PermissionIdPropertySchema.inferOut;

const PermissionStatusSchema = type.enumerated(
  PermissionStatus.ENABLED,
  PermissionStatus.DISABLED
);

const AssociationSchema = type('string[] | undefined');

export const PermissionAssociationsSchema = type({
  apps: AssociationSchema.optional(),
  roles: AssociationSchema.optional(),
});
export type PermissionAssociations =
  typeof PermissionAssociationsSchema.inferOut;

const BaseSchema = PermissionIdPropertySchema.and({
  name: type('string'),
  status: PermissionStatusSchema,
  description: type('string').optional(),
  apps: AggregateSchema.optional(),
  roles: AggregateSchema.optional(),
});

export const PermissionSchema = BaseSchema.and({
  createdAt: RequiredDateSchema,
  updatedAt: RequiredDateSchema,
  'deletedAt?': OptionalDateSchema,
  'deactivatedAt?': OptionalDateSchema,
}).and(MetadataMapPropertySchema);
export type PermissionProperties = typeof PermissionSchema.inferIn;
export type Permission = typeof PermissionSchema.inferOut;

export const PermissionPayloadSchema = BaseSchema.and({
  createdAt: RequiredDatePayloadSchema,
  updatedAt: RequiredDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
}).and(MetadataPayloadPropertySchema);
export type PermissionPayload = typeof PermissionPayloadSchema.inferOut;

/**
 * Insert
 */
export const InsertPermissionPayloadSchema = type({
  id: PermissionIdSchema.default(() => generatePermissionId()),
  name: type('string'),
  status: PermissionStatusSchema.default(PermissionStatus.ENABLED),
  description: type('string').optional(),
})
  .and(PermissionAssociationsSchema)
  .and(MetadataPayloadPropertySchema);
export type InsertPermissionInput =
  typeof InsertPermissionPayloadSchema.inferIn;
export type InsertPermissionPayload =
  typeof InsertPermissionPayloadSchema.inferOut;

/**
 * Update
 */
export const UpdatePermissionPayloadSchema = type({
  name: type('string').optional(),
  status: PermissionStatusSchema.optional(),
  description: type('string').optional(),
}).and(MetadataPayloadPropertySchema);
export type UpdatePermissionInput =
  typeof UpdatePermissionPayloadSchema.inferIn;
export type UpdatePermissionPayload =
  typeof UpdatePermissionPayloadSchema.inferOut;

/**
 * Association
 */
export const PermissionAssociationReferenceSchema =
  PermissionPayloadSchema.pick('id', 'name', 'status').and({
    model: "'Permission'",
  });
export type PermissionAssociationReference =
  typeof PermissionAssociationReferenceSchema.inferOut;
