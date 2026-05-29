import { httpLink, httpBatchStreamLink } from "@repo/trpc/client";
import { env } from "~/env.js";

interface CreateTRPCHttpBatchClientClientOpts {
  enableStreaming?: boolean;
}

export const createTRPCHttpBatchClientClient = (opts?: CreateTRPCHttpBatchClientClientOpts) => {
  const c = opts?.enableStreaming ? httpBatchStreamLink : httpLink;
  return c({
    url: (() => {
      const fallback = "http://localhost:8000/trpc";
      if (!env.NEXT_PUBLIC_API_URL) return fallback;
      const normalized = env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
      return normalized.endsWith("/trpc") ? normalized : `${normalized}/trpc`;
    })(),
    fetch(url, options) {
      return fetch(url, {
        ...options,
        credentials: "include",
      });
    },
  });
};
