import KSUID from 'ksuid';
import * as z from 'zod/v4';
import { KSUIDSchema } from '../common/schema/id.js';

export const Model = {
  Permission: {
    UIDPrefix: 'per',
  },
  Role: {
    UIDPrefix: 'rol',
  },
} as const;

export function generatePermissionId() {
  return `${Model.Permission.UIDPrefix}_${KSUID.randomSync().string}`;
}

export function generateRoleId() {
  return `${Model.Role.UIDPrefix}_${KSUID.randomSync().string}`;
}

export const RoleIdSchema = KSUIDSchema(Model.Role.UIDPrefix);
export type RoleId = z.output<typeof RoleIdSchema>;

export const RoleIdAssociationsSchema = z.union([
  z.undefined(),
  z.array(RoleIdSchema),
]);

export const PermissionIdSchema = KSUIDSchema(Model.Permission.UIDPrefix);
export type PermissionId = z.output<typeof PermissionIdSchema>;

export const PermissionIdAssociationsSchema = z.union([
  z.undefined(),
  z.array(PermissionIdSchema),
]);
