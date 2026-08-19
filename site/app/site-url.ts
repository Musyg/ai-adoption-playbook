const configuredSiteUrl = process.env.PUBLIC_SITE_URL?.trim();

export function getSiteUrl(): string | undefined {
  if (!configuredSiteUrl) return undefined;

  let parsed: URL;
  try {
    parsed = new URL(configuredSiteUrl);
  } catch {
    throw new Error("PUBLIC_SITE_URL must be an absolute HTTP or HTTPS URL.");
  }

  if (!["http:", "https:"].includes(parsed.protocol) || parsed.search || parsed.hash) {
    throw new Error("PUBLIC_SITE_URL must use HTTP or HTTPS without a query or fragment.");
  }

  return parsed.toString().replace(/\/$/, "");
}

export function siteUrlFor(pathname: string): string | undefined {
  const siteUrl = getSiteUrl();
  if (!siteUrl) return undefined;
  const suffix = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return `${siteUrl}${suffix}`;
}
