import { Router } from "itty-router";

const router = Router();

export async function handleRequest(request: Request, env: Bindings) {
  router.all("*", () => new Response("OK", { status: 200 }));
  return router.handle(request, env);
}

const worker: ExportedHandler<Bindings> = { fetch: handleRequest };

export default worker;
