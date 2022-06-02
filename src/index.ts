export async function handleRequest(request: Request, env: Bindings) {
  return Response.redirect("http://redirected.dev", 302);
}

const worker: ExportedHandler<Bindings> = { fetch: handleRequest };
export default worker;
