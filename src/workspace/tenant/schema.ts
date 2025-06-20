import { type } from 'arktype';
import { KSUIDSchema } from '../../common/schema/id.js';
import {
  InsertOrganizationPayloadSchema,
  OrganizationPayloadSchema,
  UpdateOrganizationPayloadSchema,
} from '../../customer/organization/schema.js';
import { MembershipPayloadSchema } from '../membership/schema.js';
import { Model, generateHandle, generateTenantId } from '../utils.js';

export const TenantIdSchema = KSUIDSchema(Model.Tenant.UIDPrefix);
export type TenantId = typeof TenantIdSchema.inferOut;

export const TenantIdPropertySchema = type({
  id: TenantIdSchema,
});

export const TenantPayloadSchema = OrganizationPayloadSchema.and({
  handle: type('string'),
  supportEmail: type('string.email').optional(),
  authHost: type('string.url').optional(), // Not live yet (used for dev now)
  membership: MembershipPayloadSchema.optional(),
});
export type TenantPayload = typeof TenantPayloadSchema.inferOut;

export const InsertTenantPayloadSchema = InsertOrganizationPayloadSchema.omit(
  'id'
).and({
  id: TenantIdSchema.default(() => generateTenantId()),
  handle: type('string').default(() => generateHandle()),
  supportEmail: type('string.email').optional(),
});
export type InsertTenantPayload = typeof InsertTenantPayloadSchema.inferOut;

export const UpdateTenantPayloadSchema = UpdateOrganizationPayloadSchema.and({
  handle: type('string').optional(),
  supportEmail: type('string.email').optional(),
});
export type UpdateTenantPayload = typeof UpdateTenantPayloadSchema.inferOut;
