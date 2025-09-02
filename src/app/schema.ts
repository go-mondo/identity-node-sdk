import * as z from 'zod/v4';
import {
  CreatedAtPropertyPayloadSchema,
  CreatedAtPropertySchema,
  DeactivatedAtPropertyPayloadSchema,
  DeactivatedAtPropertySchema,
  DeletedAtPropertyPayloadSchema,
  DeletedAtPropertySchema,
  UpdatedAtPropertyPayloadSchema,
  UpdatedAtPropertySchema,
} from '../common/index.js';
import { KSUIDSchema } from '../common/schema/id.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
} from '../common/schema/metadata.js';
import { Model } from './utils.js';

export const AppStatus = {
  ENABLED: 'enabled',
  DISABLED: 'disabled',
} as const;

export type AnyAppStatus = (typeof AppStatus)[keyof typeof AppStatus];

export const AppIdSchema = KSUIDSchema(Model.App.UIDPrefix);
export type AppId = z.output<typeof AppIdSchema>;

export const AppIdPropertySchema = z.object({
  id: AppIdSchema,
});
export type AppIdProperty = z.output<typeof AppIdPropertySchema>;

const StatusSchema = z.enum([AppStatus.ENABLED, AppStatus.DISABLED] as const);

const BaseSchema = z.object({
  ...AppIdPropertySchema.shape,
  status: StatusSchema,
  label: z.string(),
  description: z.string().or(z.undefined()).optional(),
});

export const AppSchema = z.object({
  ...BaseSchema.shape,
  ...CreatedAtPropertySchema.shape,
  ...UpdatedAtPropertySchema.shape,
  ...DeletedAtPropertySchema.shape,
  ...DeactivatedAtPropertySchema.shape,
  ...MetadataMapPropertySchema.shape,
});
export type AppProperties = z.input<typeof AppSchema>;
export type App = z.output<typeof AppSchema>;

export const AppPayloadSchema = z.object({
  ...BaseSchema.shape,
  ...AppIdPropertySchema.shape,
  ...CreatedAtPropertyPayloadSchema.shape,
  ...UpdatedAtPropertyPayloadSchema.shape,
  ...UpdatedAtPropertyPayloadSchema.shape,
  ...DeletedAtPropertyPayloadSchema.shape,
  ...DeactivatedAtPropertyPayloadSchema.shape,
  ...MetadataPayloadPropertySchema.shape,
});
export type AppPayload = z.output<typeof AppPayloadSchema>;

export const InsertAppPayloadSchema = z.object({
  id: AppIdSchema.optional(),
  status: StatusSchema.default(AppStatus.ENABLED),
  label: z.string(),
  description: z.string().optional(),
  ...MetadataPayloadPropertySchema.shape,
});
export type InsertAppInput = z.input<typeof InsertAppPayloadSchema>;
export type InsertAppPayload = z.output<typeof InsertAppPayloadSchema>;

export const UpdateAppPayloadSchema = z.object({
  status: StatusSchema.optional(),
  label: z.string().or(z.null()).optional(),
  description: z.string().or(z.null()).optional(),
  ...MetadataPayloadPropertySchema.shape,
});
export type UpdateAppInput = z.input<typeof UpdateAppPayloadSchema>;
export type UpdateAppPayload = z.output<typeof UpdateAppPayloadSchema>;

/**
 * Association
 */
export const AppIdAssociationsSchema = z.undefined().or(z.array(AppIdSchema));

export const AppAssociationReferenceSchema = z.object({
  ...AppIdPropertySchema.shape,
  status: StatusSchema.default('disabled'),
  label: z.string(),
  model: z.literal('App'),
});
export type AppAssociationReference = z.output<
  typeof AppAssociationReferenceSchema
>;
