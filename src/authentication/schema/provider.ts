import { type } from 'arktype';
import {
  OptionalDatePayloadSchema,
  RequiredDatePayloadSchema,
} from '../../common/schema/dates.js';
import { MetadataPayloadPropertySchema } from '../../common/schema/metadata.js';
import { UserIdSchema } from '../../customer/users/schema.js';
import { StrategyIdSchema } from './strategy/base.js';

export const ProviderType = {
  MONDO: 'mondo',
} as const;

export type AnyProviderType = (typeof ProviderType)[keyof typeof ProviderType];

export const ProviderIdSchema = type.string;
export type ProviderId = typeof ProviderIdSchema.inferOut;

export const ProviderIdPropertySchema = type({
  id: ProviderIdSchema,
});
export type ProviderIdProperty = typeof ProviderIdPropertySchema.inferOut;

export const ProviderTypeSchema = type.enumerated(ProviderType.MONDO);

export const ProviderPayloadSchema = ProviderIdPropertySchema.and({
  type: ProviderTypeSchema,
  user: UserIdSchema,
  strategy: StrategyIdSchema,
  updatedAt: RequiredDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
}).and(MetadataPayloadPropertySchema);
export type ProviderPayload = typeof ProviderPayloadSchema.inferOut;
