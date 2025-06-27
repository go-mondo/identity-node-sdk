import { type } from 'arktype';
import {
  OptionalDatePayloadSchema,
  OptionalDateSchema,
  RequiredDatePayloadSchema,
  RequiredDateSchema,
} from '../../../common/index.js';
import { KSUIDSchema } from '../../../common/schema/id.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
} from '../../../common/schema/metadata.js';
import { Model } from '../../utils.js';

export const StrategyType = {
  EMAIL: 'email',
  PASSWORD: 'password',
  TOTP: 'totp',
} as const;

export type AnyStrategyType = (typeof StrategyType)[keyof typeof StrategyType];

export const StrategyStatus = {
  ENABLED: 'enabled',
  DISABLED: 'disabled',
} as const;

export type AnyStrategyStatus =
  (typeof StrategyStatus)[keyof typeof StrategyStatus];

export const StrategyIdSchema = KSUIDSchema(Model.Strategy.UIDPrefix);
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

export const BaseStrategySchema = type({
  id: StrategyIdSchema,
  status: StrategyStatusSchema.default(StrategyStatus.ENABLED),
  label: StrategyLabelSchema,
  createdAt: RequiredDateSchema,
  updatedAt: RequiredDateSchema,
  deletedAt: OptionalDateSchema.optional(),
  deactivatedAt: OptionalDateSchema.optional(),
}).and(MetadataMapPropertySchema);

export const BaseStrategyPayloadSchema = type({
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
