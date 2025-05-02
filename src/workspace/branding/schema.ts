import { type } from 'arktype';
import { OptionalDatePayloadSchema } from '../../common/schema/dates.js';
import { MetadataPayloadPropertySchema } from '../../common/schema/metadata.js';

const LogoSchema = type({
  dark: type('string.url').optional(),
  light: type('string.url').optional(),
  email: type('string.url').optional(),
});

const ColorSchema = type({
  link: type('string').optional(),
  linkHover: type('string').optional(),
});

const BaseAttributes = type({
  logo: LogoSchema.optional(),
  color: ColorSchema.optional(),
});

export const BrandingPayloadSchema = BaseAttributes.and({
  'updatedAt?': OptionalDatePayloadSchema,
  'deletedAt?': OptionalDatePayloadSchema,
  'deactivatedAt?': OptionalDatePayloadSchema,
}).and(MetadataPayloadPropertySchema);
export type BrandingPayload = typeof BrandingPayloadSchema.inferOut;

export const UpsertBrandingPayloadSchema = BaseAttributes.and(
  MetadataPayloadPropertySchema
);
export type UpsertBrandingPayload = typeof UpsertBrandingPayloadSchema.inferOut;
