import { z } from 'zod';

export * from './aggregate.js';
export * from './collection.js';
export * from './dates.js';
export * from './jwt.js';
export * from './metadata.js';
export * from './pagination.js';
export * from './sets.js';
export * from './url.js';

export const optionallyNullishToUndefined = <T extends z.ZodTypeAny>(t: T) =>
  z
    .union([t, z.null(), z.undefined()])
    .pipe(z.transform((v) => (v == null ? undefined : v)))
    .optional();

export const optionallyNullish = <T extends z.ZodTypeAny>(t: T) =>
  z.union([t, z.null(), z.undefined()]).optional();

export const optionallyUndefined = <T extends z.ZodTypeAny>(t: T) =>
  z.union([t, z.undefined()]).optional();
