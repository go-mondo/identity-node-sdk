import { type } from 'arktype';
import {
  OptionalDatePayloadSchema,
  RequiredDatePayloadSchema,
} from '../../common/schema/dates.js';

export const FeatureFlag = {
  REMOVE_BRANDING: 'Branding.Remove',
} as const;
export type AnyFeatureFlag = (typeof FeatureFlag)[keyof typeof FeatureFlag];

export const FeaturePayloadSchema = type({
  expiresAt: RequiredDatePayloadSchema,
});
export type FeaturePayload = typeof FeaturePayloadSchema.inferOut;

export const FeaturesPayloadSchema = type({
  [FeatureFlag.REMOVE_BRANDING]: FeaturePayloadSchema.optional(),
});
export type FeaturesPayload = typeof FeaturesPayloadSchema.inferOut;

export const MembershipPayloadSchema = type({
  features: FeaturesPayloadSchema.optional(),
  'startAt?': OptionalDatePayloadSchema,
  'endAt?': OptionalDatePayloadSchema,
});
export type MembershipPayload = typeof MembershipPayloadSchema.inferOut;
