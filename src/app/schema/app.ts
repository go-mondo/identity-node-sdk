import { type } from 'arktype';
import {
  OptionalDatePayloadSchema,
  RequiredDatePayloadSchema,
} from '../../common/index.js';
import { MetadataPayloadPropertySchema } from '../../common/schema/metadata.js';
import { generateAppId } from './utils.js';

export const AppStatus = {
  ENABLED: 'enabled',
  DISABLED: 'disabled',
} as const;

export type AnyAppStatus = (typeof AppStatus)[keyof typeof AppStatus];

export const AppIdSchema = type.string;
export type AppId = typeof AppIdSchema.inferOut;

export const AppIdPropertySchema = type({
  id: AppIdSchema,
});
export type AppIdProperty = typeof AppIdPropertySchema.inferOut;

const StatusSchema = type.enumerated(AppStatus.ENABLED, AppStatus.DISABLED);

export const AppPayloadSchema = type({
  status: StatusSchema,
  label: type('string'),
  description: type('string | undefined').optional(),
  createdAt: RequiredDatePayloadSchema,
  updatedAt: RequiredDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
})
  .and(AppIdPropertySchema)
  .and(MetadataPayloadPropertySchema);
export type AppPayload = typeof AppPayloadSchema.inferOut;

export const InsertAppPayloadSchema = type({
  id: AppIdSchema.default(() => generateAppId()),
  status: StatusSchema.default(AppStatus.ENABLED),
  label: type('string'),
  description: type('string').optional(),
}).and(MetadataPayloadPropertySchema);
export type InsertAppPayload = typeof InsertAppPayloadSchema.inferOut;

export const UpdateAppPayloadSchema = type({
  status: StatusSchema.optional(),
  label: type('string').or(type.null).optional(),
  description: type('string').or(type.null).optional(),
}).and(MetadataPayloadPropertySchema);
export type UpdateAppPayload = typeof UpdateAppPayloadSchema.inferOut;

export const AppAssociationReferenceSchema = AppIdPropertySchema.and(
  type({
    status: StatusSchema,
    label: type('string'),
    model: "'App'",
  })
);
export type AppAssociationReference =
  typeof AppAssociationReferenceSchema.inferOut;
