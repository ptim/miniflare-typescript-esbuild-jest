import { Router } from "itty-router";

const router = Router();

/**
  [mf:err] GET /: TypeError: Failed to parse URL from [object Object]

    at new Request (/Users/ptim/Documents/Projects/New-Atlas/source/miniflare-typescript-esbuild-jest/node_modules/undici/lib/fetch/request.js:83:23)
    at new Request (/Users/ptim/Documents/Projects/New-Atlas/source/miniflare-typescript-esbuild-jest/node_modules/miniflare/node_modules/@miniflare/core/src/standards/http.ts:348:13)
    at EventTarget.dispatchFetch (/Users/ptim/Documents/Projects/New-Atlas/source/miniflare-typescript-esbuild-jest/node_modules/miniflare/node_modules/@miniflare/core/src/index.ts:894:51)
    at processTicksAndRejections (node:internal/process/task_queues:96:5)
    at Server.<anonymous> (/Users/ptim/Documents/Projects/New-Atlas/source/miniflare-typescript-esbuild-jest/node_modules/@miniflare/http-server/src/index.ts:179:20)
*/
export async function handleRequest(request: Request, env: Bindings) {
  router.all("*", () => new Response("OK", { status: 200 }));
  return router.handle(request, env);
}

const worker: ExportedHandler<Bindings> = { fetch: handleRequest };

export default worker;
