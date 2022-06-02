import {
  ResolvedConfig,
  wrapModule,
} from "@cloudflare/workers-honeycomb-logger";

export async function handleRequest(request: Request, env: Bindings) {
  return new Response("OK", {
    headers: new Headers({
      "x-A": "foo",
    }),
  });
}

const handler = {
  fetch: handleRequest as ExportedHandlerFetchHandler<Bindings>,
};

/** https://github.com/cloudflare/workers-honeycomb-logger */
const honeycombConfig: Partial<ResolvedConfig> = {
  dataset: "test-handler",
  /** https://github.com/cloudflare/workers-honeycomb-logger/#dynamic-sampling */
  sampleRates(data: any): number {
    try {
      console.log(data.response.headers.get?.("x-A")); // safe due to optional chaining
      console.log(data.response.headers.get("x-B")); // throws
    } catch (error) {
      // TypeError: data.response.headers.get is not a function
      // at sampleRates (~/miniflare-typescript-esbuild-jest/src/index.ts:21:41)
      console.error(error);
      /*
      typeof data.response.headers
      'object'

      data.response.headers instanceof Headers
      false
      */
    }
    return 1;
  },
};
export default wrapModule(honeycombConfig, handler);
