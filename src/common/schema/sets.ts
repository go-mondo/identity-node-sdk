import { z } from 'zod';

const StringSetTypeSchema = z.set(z.string());
// const UrlStringSchema = type('string.url[]').pipe((v) => v?.filter((i) => !!i));
const StringArrayTypeSchema = z
  .array(z.string())
  .pipe(z.transform((v) => v?.filter((i) => !!i)));

export const UniqueStringArraySchema = z
  .union([z.undefined(), StringArrayTypeSchema, StringSetTypeSchema])
  .pipe(z.transform((v) => (v instanceof Set ? Array.from(v.values()) : v)));

export const UniqueStringSetSchema = z
  .union([z.undefined(), StringArrayTypeSchema, StringSetTypeSchema])
  .pipe(z.transform((v) => (!v || v instanceof Set ? v : new Set(v))));

const UrlSetTypeSchema = z.instanceof(Set<URL>);
const UrlArrayTypeScheama = z
  .array(z.url().pipe(z.transform((url) => new URL(url))))
  .pipe(z.transform((v) => v?.filter((i) => !!i)));

export const UniqueUrlArraySchema = z
  .union([z.undefined(), UrlArrayTypeScheama, UrlSetTypeSchema])
  .pipe(z.transform((v) => (v instanceof Set ? Array.from(v.values()) : v)));

export const UniqueUrlSetSchema = z
  .union([z.undefined(), UrlArrayTypeScheama, UrlSetTypeSchema])
  .pipe(z.transform((v) => (!v || v instanceof Set ? v : new Set(v))));
