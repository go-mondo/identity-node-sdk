import { type } from 'arktype';

const StringArraySchema = type('string[]');
const StringArrayToSet = StringArraySchema.pipe((s) => new Set(s));
const StringSet = type.instanceOf(Set<string>);

export const UniqueStringSetPayloadSchema = StringSet.or(StringArrayToSet);
export const UniqueStringPayloadSchema = UniqueStringSetPayloadSchema.pipe(
  (s) => Array.from(s.values())
);
