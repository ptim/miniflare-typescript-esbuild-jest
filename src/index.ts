import { Router } from "@/vendor/itty-router/src/itty-router";

const router = Router();

export async function handleRequest(request: Request, env: Bindings) {
  router.all("/rad", () => new Response("rad!", { status: 200 }));
  router.all("*", () => new Response("OK", { status: 200 }));
  return router.handle(request, env);
}

const worker: ExportedHandler<Bindings> = { fetch: handleRequest };

export default worker;
