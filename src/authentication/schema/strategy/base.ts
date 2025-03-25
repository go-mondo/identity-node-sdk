import { type } from 'arktype';
import {
  OptionalDatePayloadSchema,
  RequiredDatePayloadSchema,
} from '../../../common/index.js';
import { MetadataPayloadPropertySchema } from '../../../common/schema/metadata.js';
import { StrategyStatus, StrategyType } from './schema.js';

export const StrategyIdSchema = type.string;
export type StrategyId = typeof StrategyIdSchema.inferOut;

export const StrategyIdPropertySchema = type({
  id: StrategyIdSchema,
});
export type StrategyIdProperty = typeof StrategyIdPropertySchema.inferOut;

export const StrategyStatusSchema = type.enumerated(
  StrategyStatus.ENABLED,
  StrategyStatus.DISABLED
);
export const StrategyTypeSchema = type.enumerated(
  StrategyType.EMAIL,
  StrategyType.PASSWORD,
  StrategyType.TOTP
);
export const StrategyLabelSchema = type('string');

export const BaseStrategyPayloadSchema = StrategyIdPropertySchema.and({
  status: StrategyStatusSchema,
  label: StrategyLabelSchema,
  createdAt: RequiredDatePayloadSchema,
  updatedAt: RequiredDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
}).and(MetadataPayloadPropertySchema);

export const BaseInsertStrategyPayloadSchema = type({
  id: StrategyIdSchema.optional(),
  label: StrategyLabelSchema,
  status: StrategyStatusSchema.default(StrategyStatus.ENABLED),
}).and(MetadataPayloadPropertySchema);

export const BaseUpdateStrategyPayloadSchema = type({
  label: StrategyLabelSchema.optional(),
  status: StrategyStatusSchema.optional(),
}).and(MetadataPayloadPropertySchema);
