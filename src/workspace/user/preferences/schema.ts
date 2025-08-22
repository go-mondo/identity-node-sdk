import { z } from 'zod';
import { OptionalDatePayloadSchema } from '../../../common/schema/dates.js';
import { UpsertMetadataPropertyPayloadSchema } from '../../../common/schema/metadata.js';

const TableSchema = z.object({
  columns: z.array(z.string()).optional(),
});

const TablesSchema = z.record(z.string(), TableSchema);

const BaseAttributes = z.object({
  views: TablesSchema.optional(),
});

export const UserPreferencesPayloadSchema = z.object({
  ...BaseAttributes.shape,
  updatedAt: OptionalDatePayloadSchema.optional(),
  deletedAt: OptionalDatePayloadSchema.optional(),
  deactivatedAt: OptionalDatePayloadSchema.optional(),
  ...UpsertMetadataPropertyPayloadSchema.shape,
});
export type UserPreferencesPayload = z.output<
  typeof UserPreferencesPayloadSchema
>;

export const UpsertUserPreferencesPayloadSchema = z.object({
  ...BaseAttributes.shape,
  ...UpsertMetadataPropertyPayloadSchema.shape,
});
export type UpsertUserPreferencesPayload = z.output<
  typeof UpsertUserPreferencesPayloadSchema
>;
