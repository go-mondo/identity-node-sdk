import * as z from 'zod/v4';

export const StringSetTypeSchema = z.set(z.string());
export const SpaceDelimitedStringToArraySchema = z
  .string()
  .pipe(z.transform((v) => v.split(' ')));
// const StringToArraySchema = z.string().pipe(z.transform((v) => v.split(' ')));

// const UrlStringSchema = type('string.url[]').pipe((v) => v?.filter((i) => !!i));
export const StringArrayTypeSchema = z
  .array(z.string())
  .pipe(z.transform((v) => v?.filter((i) => !!i)));

export const UniqueStringArraySchema = z
  .union([z.undefined(), StringArrayTypeSchema, StringSetTypeSchema])
  .pipe(z.transform((v) => (v instanceof Set ? Array.from(v.values()) : v)));

export const UniqueStringSetSchema = z
  .union([z.undefined(), StringArrayTypeSchema, StringSetTypeSchema])
  .pipe(z.transform((v) => (!v || v instanceof Set ? v : new Set(v))));
