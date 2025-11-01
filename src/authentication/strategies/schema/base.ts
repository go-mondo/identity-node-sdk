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
} from '../../../common/schema/dates.js';
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
export type StrategyId = z.output<typeof StrategyIdSchema>;

export const StrategyIdPropertySchema = z.object({
  id: StrategyIdSchema,
});
export type StrategyIdProperty = z.output<typeof StrategyIdPropertySchema>;

export const StrategyStatusSchema = z.enum([
  StrategyStatus.ENABLED,
  StrategyStatus.DISABLED,
] as const);
export const StrategyTypeSchema = z.enum([
  StrategyType.EMAIL,
  StrategyType.PASSWORD,
  StrategyType.TOTP,
] as const);
export const StrategyLabelSchema = z.string();

export const BaseStrategySchema = z.object({
  id: StrategyIdSchema,
  status: StrategyStatusSchema.default(StrategyStatus.ENABLED),
  label: StrategyLabelSchema,
  ...CreatedAtPropertySchema.shape,
  ...UpdatedAtPropertySchema.shape,
  ...DeletedAtPropertySchema.shape,
  ...DeactivatedAtPropertySchema.shape,
  ...MetadataMapPropertySchema.shape,
});

export const BaseStrategyPayloadSchema = z.object({
  id: StrategyIdSchema,
  status: StrategyStatusSchema,
  label: StrategyLabelSchema,
  ...CreatedAtPropertyPayloadSchema.shape,
  ...UpdatedAtPropertyPayloadSchema.shape,
  ...DeletedAtPropertyPayloadSchema.shape,
  ...DeactivatedAtPropertyPayloadSchema.shape,
  ...MetadataPayloadPropertySchema.shape,
});

export const BaseInsertStrategyPayloadSchema = z.object({
  id: StrategyIdSchema.optional(),
  label: StrategyLabelSchema,
  status: StrategyStatusSchema.default(StrategyStatus.ENABLED),
  ...MetadataPayloadPropertySchema.shape,
});

export const BaseUpdateStrategyPayloadSchema = z.object({
  label: StrategyLabelSchema.optional(),
  status: StrategyStatusSchema.optional(),
  ...MetadataPayloadPropertySchema.shape,
});
