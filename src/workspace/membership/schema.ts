import { z } from 'zod';
import {
  OptionalDatePayloadSchema,
  OptionalDateSchema,
  RequiredDatePayloadSchema,
} from '../../common/schema/dates.js';

export const FeatureFlag = {
  REMOVE_Membership: 'Membership.Remove',
} as const;
export type AnyFeatureFlag = (typeof FeatureFlag)[keyof typeof FeatureFlag];

export const FeaturePayloadSchema = z.object({
  expiresAt: RequiredDatePayloadSchema,
});
export type FeaturePayload = z.output<typeof FeaturePayloadSchema>;

export const FeaturesPayloadSchema = z.object({
  [FeatureFlag.REMOVE_Membership]: FeaturePayloadSchema.optional(),
});
export type FeaturesPayload = z.output<typeof FeaturesPayloadSchema>;

export const MembershipSchema = z.object({
  features: FeaturesPayloadSchema.optional(),
  startAt: OptionalDateSchema,
  endAt: OptionalDateSchema,
});
export type MembershipProperties = z.input<typeof MembershipSchema>;
export type Membership = z.output<typeof MembershipSchema>;

export const MembershipPayloadSchema = z.object({
  features: FeaturesPayloadSchema.optional(),
  startAt: OptionalDatePayloadSchema,
  endAt: OptionalDatePayloadSchema,
});
export type MembershipPayload = z.output<typeof MembershipPayloadSchema>;
