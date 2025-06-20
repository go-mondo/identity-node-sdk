import { type } from 'arktype';
import KSUID from 'ksuid';
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
export type RoleId = typeof RoleIdSchema.inferOut;

export const RoleIdAssociationsSchema = type('undefined').or(
  RoleIdSchema.array()
);

export const PermissionIdSchema = KSUIDSchema(Model.Permission.UIDPrefix);
export type PermissionId = typeof PermissionIdSchema.inferOut;

export const PermissionIdAssociationsSchema = type('undefined').or(
  PermissionIdSchema.array()
);
