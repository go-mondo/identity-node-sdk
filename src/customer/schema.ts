import { z } from 'zod';
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
export type UserId = z.output<typeof UserIdSchema>;

export const UserIdAssociationsSchema = z.union([
  z.undefined(),
  z.array(UserIdSchema),
]);

export const OrganizationIdSchema = KSUIDSchema(Model.Organization.UIDPrefix);
export type OrganizationId = z.output<typeof OrganizationIdSchema>;

export const OrganizationIdAssociationsSchema = z.union([
  z.undefined(),
  z.array(OrganizationIdSchema),
]);
