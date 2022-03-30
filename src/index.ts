const createMetaTag = async () => {
  const res = await fetch(
    "https://www.timeapi.io/api/Time/current/zone?timeZone=Australia/Melbourne"
  );
  const json: any = await res.json();
  const metaTag = `<meta name="cf-injected-time" content="${json?.dateTime}">`;
  console.log("Look for the meta tag in the iframe head in devtools 👍", {
    json,
  });
  return metaTag;
};

class HeadElementHandler implements HTMLRewriterElementContentHandlers {
  async element(el: Element) {
    el.prepend(await createMetaTag(), { html: true });
  }
}

/**
 * @see https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/#element-handlers
 * @see https://developers.cloudflare.com/workers/examples/rewrite-links/
 */
export async function handleRequest(request: Request, env: Bindings) {
  const res = await fetch("https://en.wikipedia.org/");

  /**
   * Loading homepage on clientside spawns a bunch of other request that this worker
   * will also handle - return early if it's not a homepage request
   */
  const isHomepage = new URL(request.url).pathname === "/";
  if (!isHomepage) return res;

  // If the response is HTML, it can be transformed with
  // HTMLRewriter -- otherwise, it should pass through
  const contentType = res.headers.get("Content-Type");
  if (contentType?.startsWith("text/html")) {
    const rewriter = new HTMLRewriter().on("head", new HeadElementHandler());
    return rewriter.transform(res);
  } else {
    return res;
  }
}

const worker: ExportedHandler<Bindings> = { fetch: handleRequest };

// Make sure we export the Counter Durable Object class
export { Counter } from "./counter";
export default worker;
