import { type } from 'arktype';
import { AppIdSchema } from 'src/app/schema.js';
import {
  OptionalDatePayloadSchema,
  OptionalDateSchema,
  RequiredDatePayloadSchema,
  RequiredDateSchema,
} from '../../common/index.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
  UpsertMetadataPayloadPropertySchema,
} from '../../common/schema/metadata.js';
import { generateActivityId } from './utils.js';

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

export const ActivityIdSchema = type.string;
export type ActivityId = typeof ActivityIdSchema.inferOut;

export const ActivityIdPropertySchema = type({
  id: ActivityIdSchema,
});
export type ActivityIdProperty = typeof ActivityIdPropertySchema.inferOut;

export const SourceSchema = type('string');

export const PerformedBySchema = type({
  type: type.enumerated(
    PerformerType.SYSTEM,
    PerformerType.GUEST,
    PerformerType.IDENTITY,
    PerformerType.AUTOMATION,
    PerformerType.INTEGRATION
  ),
  identifier: type('string'),
});
export type PerformedBy = typeof PerformedBySchema.inferOut;

const CommonSchema = type({
  id: ActivityIdSchema,
  performedBy: PerformedBySchema,
  source: SourceSchema,
  app: AppIdSchema.optional(),
  isMutateable: type('boolean'),
});

export const BaseSchema = CommonSchema.and({
  createdAt: RequiredDateSchema,
  updatedAt: RequiredDateSchema,
  deletedAt: OptionalDateSchema.optional(),
  deactivatedAt: OptionalDateSchema.optional(),
}).and(MetadataMapPropertySchema);

export const BasePayloadSchema = CommonSchema.and({
  createdAt: RequiredDatePayloadSchema,
  updatedAt: RequiredDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
}).and(MetadataPayloadPropertySchema);

export const BaseInsertPayloadSchema = type({
  id: ActivityIdSchema.default(() => generateActivityId()),
  performedBy: PerformedBySchema.optional(),
}).and(UpsertMetadataPayloadPropertySchema);

export const BaseUpdatePayloadSchema = type({
  performedBy: PerformedBySchema.optional(),
}).and(UpsertMetadataPayloadPropertySchema);
