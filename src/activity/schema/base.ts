import * as z from 'zod/v4';
import { AppIdSchema } from '../../app/schema.js';
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
import { KSUIDSchema } from '../../common/schema/id.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
  UpsertMetadataPropertyPayloadSchema,
} from '../../common/schema/metadata.js';
import { Model, generateActivityId } from './utils.js';

export const ActivityType = {
  UNKNOWN: 'unknown',
  NOTE: 'note',
  OPERATION: 'operation',
  AUTHORIZATION: 'authorization',
  AUTHENTICATION: 'authentication',
} as const;

export type AnyActivityType = (typeof ActivityType)[keyof typeof ActivityType];

export const PerformerType = {
  SYSTEM: 'system',
  GUEST: 'guest',
  IDENTITY: 'identity',
  AUTOMATION: 'automation',
  INTEGRATION: 'integration',
} as const;

export type AnyPerformerType =
  (typeof PerformerType)[keyof typeof PerformerType];

export const ActivityIdSchema = KSUIDSchema(Model.Activity.UIDPrefix);
export type ActivityId = z.output<typeof ActivityIdSchema>;

export const ActivityIdPropertySchema = z.object({
  id: ActivityIdSchema,
});
export type ActivityIdProperty = z.output<typeof ActivityIdPropertySchema>;

export const SourceSchema = z.string();

export const PerformedBySchema = z.object({
  type: z.enum([
    PerformerType.SYSTEM,
    PerformerType.GUEST,
    PerformerType.IDENTITY,
    PerformerType.AUTOMATION,
    PerformerType.INTEGRATION,
  ] as const),
  identifier: z.string(),
});
export type PerformedBy = z.output<typeof PerformedBySchema>;

const CommonSchema = z.object({
  id: ActivityIdSchema,
  performedBy: PerformedBySchema,
  source: SourceSchema,
  app: AppIdSchema.optional(),
  isMutateable: z.boolean(),
});

export const BaseSchema = z.object({
  ...CommonSchema.shape,
  ...CreatedAtPropertySchema.shape,
  ...UpdatedAtPropertySchema.shape,
  ...DeletedAtPropertySchema.shape,
  ...DeactivatedAtPropertySchema.shape,
  ...MetadataMapPropertySchema.shape,
});

export const BasePayloadSchema = z.object({
  ...CommonSchema.shape,
  ...CreatedAtPropertyPayloadSchema.shape,
  ...UpdatedAtPropertyPayloadSchema.shape,
  ...DeletedAtPropertyPayloadSchema.shape,
  ...DeactivatedAtPropertyPayloadSchema.shape,
  ...MetadataPayloadPropertySchema.shape,
});

export const BaseInsertPayloadSchema = z.object({
  id: ActivityIdSchema.default(() => generateActivityId()),
  performedBy: PerformedBySchema.optional(),
  ...UpsertMetadataPropertyPayloadSchema.shape,
});

export const BaseUpdatePayloadSchema = z.object({
  performedBy: PerformedBySchema.optional(),
  ...UpsertMetadataPropertyPayloadSchema.shape,
});
