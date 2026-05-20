import { promises as fs } from "node:fs";
import path from "node:path";
import {
  ClientConfigSchemaStrict,
  type ClientConfig,
} from "./types";

const CONFIG_DIR = path.join(process.cwd(), "config", "clients");

export class ClientConfigError extends Error {
  constructor(
    public kind: "not-found" | "invalid-json" | "schema" | "meta-mismatch",
    public slug: string,
    public detail?: unknown,
  ) {
    super(`[ClientConfigError:${kind}] slug=${slug}`);
    this.name = "ClientConfigError";
  }
}

type CacheEntry = { config: ClientConfig; mtimeMs: number };
const cache = new Map<string, CacheEntry>();

export async function loadClient(slug: string): Promise<ClientConfig> {
  const filePath = path.join(CONFIG_DIR, `${slug}.json`);

  let stat;
  try {
    stat = await fs.stat(filePath);
  } catch (err: unknown) {
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code?: string }).code === "ENOENT"
    ) {
      throw new ClientConfigError("not-found", slug);
    }
    throw err;
  }

  const cached = cache.get(slug);
  if (cached && cached.mtimeMs === stat.mtimeMs) {
    return cached.config;
  }

  const raw = await fs.readFile(filePath, "utf-8");

  let parsed: unknown;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new ClientConfigError("invalid-json", slug, err);
  }

  const result = ClientConfigSchemaStrict.safeParse(parsed);
  if (!result.success) {
    const hasMetaMismatch = result.error.issues.some((i) =>
      typeof i.message === "string" &&
      i.message.includes("does not match businessType"),
    );
    throw new ClientConfigError(
      hasMetaMismatch ? "meta-mismatch" : "schema",
      slug,
      result.error.format(),
    );
  }

  cache.set(slug, { config: result.data, mtimeMs: stat.mtimeMs });
  return result.data;
}

export async function resolveClient(headers: Headers): Promise<ClientConfig> {
  const host = headers.get("host") ?? "ddpage.kr";
  const slug = hostnameToSlug(host);
  return loadClient(slug);
}

export function hostnameToSlug(host: string): string {
  const hostname = host.split(":")[0];

  // 로컬 개발 환경
  if (
    hostname === "localhost" ||
    hostname === "127.0.0.1" ||
    hostname.endsWith(".local")
  ) {
    return process.env.NEXT_PUBLIC_DEFAULT_SLUG ?? "ddpage";
  }

  const parts = hostname.split(".");

  // ddpage.kr (2 parts) → "ddpage"
  if (parts.length === 2) {
    return parts[0];
  }

  // www.ddpage.kr (3 parts, www prefix) → "ddpage"
  if (parts.length === 3 && parts[0] === "www") {
    return parts[1];
  }

  // client1.ddpage.kr (3 parts, subdomain) → "client1"
  if (parts.length === 3) {
    return parts[0];
  }

  // 그 외 (.co.kr, IP 등) → fallback
  return process.env.NEXT_PUBLIC_DEFAULT_SLUG ?? "ddpage";
}

export async function listClientSlugs(): Promise<string[]> {
  try {
    const files = await fs.readdir(CONFIG_DIR);
    return files
      .filter((f) => f.endsWith(".json"))
      .map((f) => f.replace(/\.json$/, ""));
  } catch {
    return [];
  }
}

// 테스트/디버그용 — 캐시 비우기
export function clearClientCache(): void {
  cache.clear();
}
