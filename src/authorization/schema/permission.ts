import { type } from 'arktype';
import {
  OptionalDatePayloadSchema,
  RequiredDatePayloadSchema,
} from '../../common/index.js';
import { AggregateSchema } from '../../common/schema/aggregate.js';
import { MetadataPayloadPropertySchema } from '../../common/schema/metadata.js';
import { generatePermissionId } from './utils.js';

export const PermissionStatus = {
  ENABLED: 'enabled',
  DISABLED: 'disabled',
} as const;

export type AnyPermissionStatus =
  (typeof PermissionStatus)[keyof typeof PermissionStatus];

const PermissionIdSchema = type.string;

export const PermissionIdPropertySchema = type({
  id: PermissionIdSchema,
});
export type PermissionIdProperty = typeof PermissionIdPropertySchema.inferOut;

const StatusSchema = type.enumerated(
  PermissionStatus.ENABLED,
  PermissionStatus.DISABLED
);

export const PermissionPayloadSchema = PermissionIdPropertySchema.and({
  name: type('string'),
  status: StatusSchema,
  description: type('string').optional(),
  apps: AggregateSchema.optional(),
  roles: AggregateSchema.optional(),
  createdAt: RequiredDatePayloadSchema,
  updatedAt: RequiredDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
})
  .and(PermissionIdPropertySchema)
  .and(MetadataPayloadPropertySchema);
export type PermissionPayload = typeof PermissionPayloadSchema.inferOut;

export const InsertPermissionPayloadSchema = type({
  id: PermissionIdSchema.default(() => generatePermissionId()),
  name: type('string'),
  status: StatusSchema.default(PermissionStatus.ENABLED),
  description: type('string').optional(),
}).and(MetadataPayloadPropertySchema);
export type InsertPermissionPayload =
  typeof InsertPermissionPayloadSchema.inferOut;

export const UpdatePermissionPayloadSchema = type({
  name: type('string').optional(),
  status: StatusSchema.optional(),
  description: type('string').optional(),
}).and(MetadataPayloadPropertySchema);
export type UpdatePermissionPayload =
  typeof UpdatePermissionPayloadSchema.inferOut;

const AssociationSchema = type('string[] | undefined');

export const PermissionAssociationsSchema = type({
  '+': 'delete',
  apps: AssociationSchema.optional(),
  roles: AssociationSchema.optional(),
});
export type PermissionAssociations =
  typeof PermissionAssociationsSchema.inferOut;

export const PermissionAssociationReferenceSchema =
  PermissionPayloadSchema.pick('id', 'name', 'status').and({
    model: "'Permission'",
  });
export type PermissionAssociationReference =
  typeof PermissionAssociationReferenceSchema.inferOut;
