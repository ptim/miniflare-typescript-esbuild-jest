import { Miniflare } from "miniflare";

// PASSES
test("set `cf` in RequestInit", () => {
  const request = new Request("http://localhost:8787", {
    cf: { regionCode: "CA" } as IncomingRequestCfProperties,
  });
  expect(request.cf?.regionCode).toBe("CA");
});

// FAILS
test("set `cf` via Miniflare#metaProvider", async () => {
  async function handleRequest(request: Request) {
    // undefined
    expect(request.cf?.regionCode).toBe("CA");
    return new Response("OK");
  }

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
    /**
     * > Added a metaProvider option that allows you fetch metadata for an incoming Request
     * > https://github.com/cloudflare/miniflare/releases/tag/v2.0.0
     *
     * https://github.com/cloudflare/miniflare/issues/61#issuecomment-952817275
     * https://github.com/cloudflare/miniflare/commit/b7ddbb36f0a1998519a4ac179e1a609cad7e75be#diff-a732a2a999ca2078de283e7dab7fe68fef00ec14cda5e89c1fb8d3a26518fc2eR31
     */
    async metaProvider(_req: Request) {
      return {
        // forwardedProto: req.headers.get("X-Forwarded-Proto"),
        // realIp: req.headers.get("X-Forwarded-For"),
        cf: {
          regionCode: "CA",
        },
      };
    },
  });

  await mf.dispatchFetch("http://localhost:8787/");
  expect.assertions(1);
});
