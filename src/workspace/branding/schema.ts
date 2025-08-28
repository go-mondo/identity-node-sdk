import { z } from 'zod';
import {
  OptionalDatePayloadSchema,
  OptionalDateSchema,
} from '../../common/schema/dates.js';
import {
  MetadataMapPropertySchema,
  MetadataPayloadPropertySchema,
} from '../../common/schema/metadata.js';

const LogoSchema = z.object({
  dark: z.url().optional(),
  light: z.url().optional(),
  email: z.url().optional(),
});

const ColorSchema = z.object({
  link: z.string().optional(),
  linkHover: z.string().optional(),
});

const BaseSchema = z.object({
  logo: LogoSchema.optional(),
  color: ColorSchema.optional(),
});

export const BrandingSchema = z.object({
  ...BaseSchema.shape,
  updatedAt: OptionalDateSchema,
  deletedAt: OptionalDateSchema,
  deactivatedAt: OptionalDateSchema,
  ...MetadataMapPropertySchema.shape,
});
export type BrandingProperties = z.input<typeof BrandingSchema>;
export type Branding = z.output<typeof BrandingSchema>;

export const BrandingPayloadSchema = z.object({
  ...BaseSchema.shape,
  updatedAt: OptionalDatePayloadSchema,
  deletedAt: OptionalDatePayloadSchema,
  deactivatedAt: OptionalDatePayloadSchema,
  ...MetadataPayloadPropertySchema.shape,
});
export type BrandingPayload = z.output<typeof BrandingPayloadSchema>;

export const UpsertBrandingPayloadSchema = z.object({
  ...BaseSchema.shape,
  ...MetadataPayloadPropertySchema.shape,
});
export type UpsertBrandingPayload = z.output<
  typeof UpsertBrandingPayloadSchema
>;
