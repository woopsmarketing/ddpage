import { buildBreadcrumb } from "@/lib/seo/helpers";

/**
 * BreadcrumbList — thin wrapper around `helpers.buildBreadcrumb` so all schema
 * generators live in one folder for consistency.
 */
export function breadcrumbSchema(
  host: string,
  trail: { name: string; pathname: string }[],
) {
  return buildBreadcrumb(host, trail);
}
