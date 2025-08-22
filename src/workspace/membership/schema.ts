import { z } from 'zod';
import {
  OptionalDatePayloadSchema,
  RequiredDatePayloadSchema,
} from '../../common/schema/dates.js';

export const FeatureFlag = {
  REMOVE_BRANDING: 'Branding.Remove',
} as const;
export type AnyFeatureFlag = (typeof FeatureFlag)[keyof typeof FeatureFlag];

export const FeaturePayloadSchema = z.object({
  expiresAt: RequiredDatePayloadSchema,
});
export type FeaturePayload = z.output<typeof FeaturePayloadSchema>;

export const FeaturesPayloadSchema = z.object({
  [FeatureFlag.REMOVE_BRANDING]: FeaturePayloadSchema.optional(),
});
export type FeaturesPayload = z.output<typeof FeaturesPayloadSchema>;

export const MembershipPayloadSchema = z.object({
  features: FeaturesPayloadSchema.optional(),
  startAt: OptionalDatePayloadSchema.optional(),
  endAt: OptionalDatePayloadSchema.optional(),
});
export type MembershipPayload = z.output<typeof MembershipPayloadSchema>;
