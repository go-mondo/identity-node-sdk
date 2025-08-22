import { z } from 'zod';
import { OptionalDatePayloadSchema } from '../../common/schema/dates.js';
import { MetadataPayloadPropertySchema } from '../../common/schema/metadata.js';

const LogoSchema = z.object({
  dark: z.url().optional(),
  light: z.url().optional(),
  email: z.url().optional(),
});

const ColorSchema = z.object({
  link: z.string().optional(),
  linkHover: z.string().optional(),
});

const BaseAttributes = z.object({
  logo: LogoSchema.optional(),
  color: ColorSchema.optional(),
});

export const BrandingPayloadSchema = z.object({
  ...BaseAttributes.shape,
  updatedAt: OptionalDatePayloadSchema.optional(),
  deletedAt: OptionalDatePayloadSchema.optional(),
  deactivatedAt: OptionalDatePayloadSchema.optional(),
  ...MetadataPayloadPropertySchema.shape,
});
export type BrandingPayload = z.output<typeof BrandingPayloadSchema>;

export const UpsertBrandingPayloadSchema = z.object({
  ...BaseAttributes.shape,
  ...MetadataPayloadPropertySchema.shape,
});
export type UpsertBrandingPayload = z.output<
  typeof UpsertBrandingPayloadSchema
>;
