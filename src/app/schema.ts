import { type } from 'arktype';
import {
  OptionalDatePayloadSchema,
  OptionalDateSchema,
  RequiredDatePayloadSchema,
  RequiredDateSchema,
} from '../common/index.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
} from '../common/schema/metadata.js';
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

const BaseSchema = AppIdPropertySchema.and({
  status: StatusSchema,
  label: type('string'),
  description: type('string | undefined').optional(),
});

export const AppSchema = BaseSchema.and({
  createdAt: RequiredDateSchema,
  updatedAt: RequiredDateSchema,
  deletedAt: OptionalDateSchema.optional(),
  deactivatedAt: OptionalDateSchema.optional(),
}).and(MetadataMapPropertySchema);
export type AppProperties = typeof AppSchema.inferIn;
export type App = typeof AppSchema.inferOut;

export const AppPayloadSchema = BaseSchema.and({
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
export type InsertAppInput = typeof InsertAppPayloadSchema.inferIn;
export type InsertAppPayload = typeof InsertAppPayloadSchema.inferOut;

export const UpdateAppPayloadSchema = type({
  status: StatusSchema.optional(),
  label: type('string').or(type.null).optional(),
  description: type('string').or(type.null).optional(),
}).and(MetadataPayloadPropertySchema);
export type UpdateAppInput = typeof UpdateAppPayloadSchema.inferIn;
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
