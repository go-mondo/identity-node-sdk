import { type } from 'arktype';
import {
  OptionalDatePayloadSchema,
  OptionalDateSchema,
} from '../../common/schema/dates.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
} from '../../common/schema/metadata.js';
import { generateOAuthId } from '../utils.js';

export const OAuthIdSchema = type.string;
export type OAuthId = typeof OAuthIdSchema.inferOut;

export const OAuthIdPropertySchema = type({
  id: OAuthIdSchema,
});
export type OAuthIdProperty = typeof OAuthIdPropertySchema.inferOut;

const BaseOAuth = OAuthIdPropertySchema.and({
  clientId: type('string'),
  clientSecret: type('string'),
});

export const OAuthSchema = BaseOAuth.and({
  'updatedAt?': OptionalDateSchema,
  'deletedAt?': OptionalDateSchema,
  'deactivatedAt?': OptionalDateSchema,
}).and(MetadataMapPropertySchema);
export type OAuthProperties = typeof OAuthSchema.inferIn;
export type OAuth = typeof OAuthSchema.inferOut;

export const OAuthPayloadSchema = BaseOAuth.and({
  'updatedAt?': OptionalDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
}).and(MetadataPayloadPropertySchema);
export type OAuthPayload = typeof OAuthPayloadSchema.inferOut;

export const InsertOAuthPayloadSchema = type({
  id: OAuthIdSchema.default(() => generateOAuthId()),
}).and(MetadataPayloadPropertySchema);
export type InsertOAuthInput = typeof InsertOAuthPayloadSchema.inferIn;
export type InsertOAuthPayload = typeof InsertOAuthPayloadSchema.inferOut;
