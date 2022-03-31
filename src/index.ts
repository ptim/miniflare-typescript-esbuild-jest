export async function handleRequest(request: Request, env: Bindings) {
  return new Response("OK");
}

const worker: ExportedHandler<Bindings> = { fetch: handleRequest };
export default worker;
