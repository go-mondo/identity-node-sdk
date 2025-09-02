import * as z from 'zod/v4';
import {
  DeactivatedAtPropertyPayloadSchema,
  DeletedAtPropertyPayloadSchema,
  UpdatedAtPropertyPayloadSchema,
} from '../../common/schema/dates.js';
import { MetadataPayloadPropertySchema } from '../../common/schema/metadata.js';
import { UserIdSchema } from '../../customer/schema.js';
import { StrategyIdSchema } from '../strategies/schema/base.js';

export const ProviderType = {
  MONDO: 'mondo',
} as const;

export type AnyProviderType = (typeof ProviderType)[keyof typeof ProviderType];

export const ProviderIdSchema = z.string();
export type ProviderId = z.output<typeof ProviderIdSchema>;

export const ProviderIdPropertySchema = z.object({
  id: ProviderIdSchema,
});
export type ProviderIdProperty = z.output<typeof ProviderIdPropertySchema>;

export const ProviderTypeSchema = z.enum([ProviderType.MONDO] as const);

export const ProviderPayloadSchema = z.object({
  ...ProviderIdPropertySchema.shape,
  type: ProviderTypeSchema,
  user: UserIdSchema,
  strategy: StrategyIdSchema,
  ...UpdatedAtPropertyPayloadSchema.shape,
  ...DeletedAtPropertyPayloadSchema.shape,
  ...DeactivatedAtPropertyPayloadSchema.shape,
  ...MetadataPayloadPropertySchema.shape,
});
export type ProviderPayload = z.output<typeof ProviderPayloadSchema>;
