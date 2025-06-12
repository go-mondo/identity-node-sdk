export function appendSearchParams(
  path: string,
  params: Map<string, string | undefined | null> | URLSearchParams
): string {
  const vals = Array.from(params.entries()).reduce((result, [key, val]) => {
    if (val) {
      result.push(`${key}=${val}`);
    }

    return result;
  }, [] as string[]);

  return [path, vals.filter(Boolean).join('&')].filter(Boolean).join('?');
}
