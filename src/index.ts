export async function handleRequest(request: Request, env: Bindings) {
  const url = new URL(request.url);
  return new Response(JSON.stringify({ url, env, request }, null, 2));
}

const worker: ExportedHandler<Bindings> = { fetch: handleRequest };

export default worker;
