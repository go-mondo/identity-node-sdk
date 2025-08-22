import { z } from 'zod';

const StringArraySchema = z.array(z.string());
const StringArrayToSet = StringArraySchema.pipe(z.transform((s) => new Set(s)));
const StringSet = z.instanceof(Set<string>);

export const UniqueStringSetPayloadSchema = z.union([
  StringSet,
  StringArrayToSet,
]);
export const UniqueStringPayloadSchema = UniqueStringSetPayloadSchema.pipe(
  z.transform((s) => Array.from(s.values()))
);
