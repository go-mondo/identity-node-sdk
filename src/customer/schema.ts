import { type } from 'arktype';
import KSUID from 'ksuid';
import { KSUIDSchema } from '../common/schema/id.js';

export const Model = {
  Organization: {
    UIDPrefix: 'org',
  },
  User: {
    UIDPrefix: 'usr',
  },
} as const;

export function generateUserId() {
  return `${Model.User.UIDPrefix}_${KSUID.randomSync().string}`;
}

export function generateOrganizationId() {
  return `${Model.Organization.UIDPrefix}_${KSUID.randomSync().string}`;
}

export const UserIdSchema = KSUIDSchema(Model.User.UIDPrefix);
export type UserId = typeof UserIdSchema.inferOut;

export const UserIdAssociationsSchema = type('undefined').or(
  UserIdSchema.array()
);

export const OrganizationIdSchema = KSUIDSchema(Model.Organization.UIDPrefix);
export type OrganizationId = typeof OrganizationIdSchema.inferOut;

export const OrganizationIdAssociationsSchema = type('undefined').or(
  OrganizationIdSchema.array()
);
