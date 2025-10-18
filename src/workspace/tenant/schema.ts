import * as z from 'zod/v4';
import { KSUIDSchema } from '../../common/schema/id.js';
import {
  InsertOrganizationPayloadSchema,
  OrganizationPayloadSchema,
  OrganizationSchema,
  UpdateOrganizationPayloadSchema,
} from '../../customer/organization/schema.js';
import { MembershipPayloadSchema } from '../membership/schema.js';
import { Model, generateHandle, generateTenantId } from '../utils.js';

export const TenantIdSchema = KSUIDSchema(Model.Tenant.UIDPrefix);
export type TenantId = z.output<typeof TenantIdSchema>;

export const TenantIdPropertySchema = z.object({
  id: TenantIdSchema,
});

const BaseSchema = z.object({
  ...TenantIdPropertySchema.shape,
  handle: z.string(),
  supportEmail: z.email().optional(),
  authHost: z.url().optional(), // Not live yet (used for dev now)
  membership: MembershipPayloadSchema.optional(),
});

export const TenantSchema = z.object({
  ...OrganizationSchema.shape,
  ...BaseSchema.shape,
});
export type TenantProperties = z.input<typeof TenantSchema>;
export type Tenant = z.output<typeof TenantSchema>;

export const TenantPayloadSchema = z.object({
  ...OrganizationPayloadSchema.shape,
  ...BaseSchema.shape,
});
export type TenantPayload = z.output<typeof TenantPayloadSchema>;

export const InsertTenantPayloadSchema = z.object({
  ...InsertOrganizationPayloadSchema.omit({
    id: true,
  }).shape,
  id: TenantIdSchema.default(() => generateTenantId()),
  handle: z.string().default(() => generateHandle()),
  supportEmail: z.email().optional(),
});
export type InsertTenantPayload = z.output<typeof InsertTenantPayloadSchema>;

export const UpdateTenantPayloadSchema = z.object({
  ...UpdateOrganizationPayloadSchema.shape,
  handle: z.string().optional(),
  supportEmail: z.email().optional(),
});
export type UpdateTenantPayload = z.output<typeof UpdateTenantPayloadSchema>;
