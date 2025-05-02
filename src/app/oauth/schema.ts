import { type } from 'arktype';
import { OptionalDatePayloadSchema } from '../../common/schema/dates.js';
import { MetadataPayloadPropertySchema } from '../../common/schema/metadata.js';
import { generateOAuthId } from '../utils.js';

export const OAuthIdSchema = type.string;
export type OAuthId = typeof OAuthIdSchema.inferOut;

export const OAuthIdPropertySchema = type({
  id: OAuthIdSchema,
});
export type OAuthIdProperty = typeof OAuthIdPropertySchema.inferOut;

export const OAuthPayloadSchema = OAuthIdPropertySchema.and({
  clientId: type('string'),
  clientSecret: type('string'),

  'updatedAt?': OptionalDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
}).and(MetadataPayloadPropertySchema);
export type OAuthPayload = typeof OAuthPayloadSchema.inferOut;

export const InsertOAuthPayloadSchema = type({
  id: OAuthIdSchema.default(() => generateOAuthId()),
}).and(MetadataPayloadPropertySchema);
export type InsertOAuthPayload = typeof InsertOAuthPayloadSchema.inferOut;
