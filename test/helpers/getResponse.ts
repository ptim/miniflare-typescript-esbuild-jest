import { Miniflare } from "miniflare";

/**
 * ```ts
 * const handler = async () => new Response('ok')
 * const response = await getResponse(handler)
 * ```
 *
 * @see https://miniflare.dev/get-started/api/#dispatching-events
 */
export async function getResponse(
  handleRequest: ExportedHandlerFetchHandler<Bindings>,
  urlOrRequest?: string | Request
) {
  const mf = new Miniflare({
    script: `
        export default {
          fetch: handleRequest,
        }
      `,
    globals: {
      handleRequest,
    },
    modules: true,
  });

  let url = "http://localhost:8787/";
  let init = null;

  if (typeof urlOrRequest === "string") {
    url = urlOrRequest;
  } else if (urlOrRequest instanceof Request) {
    url = urlOrRequest.url;
    init = urlOrRequest;
  }

  // @ts-ignore Type 'Request' is missing the following properties from type 'Request': #private, cache...
  return await mf.dispatchFetch(url, init);
}
