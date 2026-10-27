import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import type { Connect } from "vite";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Prerendered page directories use canonical trailing-slash URLs.
const withoutBase = (path: string, base: string) =>
  path.startsWith(base) ? `/${path.slice(base.length)}` : path;

const canonicalWorkRoutes =
  (base: string): Connect.NextHandleFunction =>
  (request, response, next) => {
    const url = new URL(request.url ?? "/", "http://localhost");
    if (
      /^\/(work\/(automation|code|quadyx)|workshop|previous)$/.test(
        withoutBase(url.pathname, base),
      )
    ) {
      response.writeHead(308, { Location: `${url.pathname}/${url.search}` });
      response.end();
    } else next();
  };

export default defineConfig({
  base: process.env.SITE_BASE_PATH || "/",
  plugins: [
    react(),
    {
      name: "canonical-work-routes",
      configureServer(server) {
        server.middlewares.use(canonicalWorkRoutes(server.config.base));
      },
      configurePreviewServer(server) {
        server.middlewares.use(canonicalWorkRoutes(server.config.base));
        server.middlewares.use((request, response, next) => {
          const path = withoutBase(
            new URL(request.url ?? "/", "http://localhost").pathname,
            server.config.base,
          );
          const known =
            path === "/" ||
            path === "/workshop/" ||
            /^\/work\/(automation|code|quadyx)\/$/.test(path) ||
            path.startsWith("/previous");
          const navigation =
            !path.includes(".") &&
            !/^\/(assets|brand|images|models)\//.test(path);
          if (
            !known &&
            navigation &&
            (request.method === "GET" || request.method === "HEAD")
          ) {
            response.writeHead(404, {
              "Content-Type": "text/html; charset=utf-8",
            });
            response.end(
              readFileSync(
                resolve(
                  server.config.root,
                  server.config.build.outDir,
                  "404.html",
                ),
              ),
            );
          } else next();
        });
      },
    },
  ],
});
