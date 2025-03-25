import { type } from 'arktype';
import {
  OptionalDatePayloadSchema,
  RequiredDatePayloadSchema,
} from '../../common/index.js';
import {
  MetadataPayloadPropertySchema,
  UpsertMetadataPayloadPropertySchema,
} from '../../common/schema/metadata.js';
import { PerformerType } from './schema.js';
import { generateActivityId } from './utils.js';

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

export const BasePayloadSchema = type({
  id: ActivityIdSchema,
  performedBy: PerformedBySchema,
  source: SourceSchema,
  isMutateable: type('boolean'),
  createdAt: RequiredDatePayloadSchema,
  updatedAt: RequiredDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
}).and(MetadataPayloadPropertySchema);

export const BaseInsertPayloadSchema = type({
  id: ActivityIdSchema.default(generateActivityId()),
  performedBy: PerformedBySchema.optional(),
}).and(UpsertMetadataPayloadPropertySchema);

export const BaseUpdatePayloadSchema = type({
  performedBy: PerformedBySchema.optional(),
}).and(UpsertMetadataPayloadPropertySchema);
