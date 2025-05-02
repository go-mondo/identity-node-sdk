import type { Type, type } from 'arktype';

export * from './aggregate.js';
export * from './collection.js';
export * from './dates.js';
export * from './jwt.js';
export * from './metadata.js';
export * from './pagination.js';
export * from './sets.js';

export const optionallyNullishToUndefined = <t extends type.Any>(
  t: t
): [type<t['t'] | undefined>, '?'] =>
  (t as Type)
    .or('null | undefined')
    .pipe((v) => (v == null ? v : undefined))
    .optional() as never;

export const optionallyNullish = <t extends type.Any>(
  t: t
): [type<t['t'] | null | undefined>, '?'] =>
  (t as Type).or('null | undefined').optional() as never;

export const optionallyUndefined = <t extends type.Any>(
  t: t
): [type<t['t'] | undefined>, '?'] =>
  (t as Type).or('undefined').optional() as never;
