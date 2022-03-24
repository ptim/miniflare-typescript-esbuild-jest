import { Miniflare } from "miniflare";

/*
● Test suite failed to run

Jest encountered an unexpected token

Jest failed to parse a file. This happens e.g. when your code or its dependencies use non-standard JavaScript syntax, or when Jest is not configured to support such syntax.

Out of the box Jest supports Babel, which will be used to transform your files into valid JS based on your Babel configuration.

By default "node_modules" folder is ignored by transformers.

Here's what you can do:
 • If you are trying to use ECMAScript Modules, see https://jestjs.io/docs/ecmascript-modules for how to enable it.
 • If you are trying to use TypeScript, see https://jestjs.io/docs/getting-started#using-typescript
 • To have some of your "node_modules" files transformed, you can specify a custom "transformIgnorePatterns" in your config.
 • If you need a custom transformation specify a "transform" option in your config.
 • If you simply want to mock your non-JS modules (e.g. binary assets) you can stub them out with the "moduleNameMapper" config option.

You'll find more details and examples of these config options in the docs:
https://jestjs.io/docs/configuration
For information about custom transformations, see:
https://jestjs.io/docs/code-transformation

Details:

/source/miniflare-typescript-esbuild-jest/node_modules/undici/lib/llhttp/llhttp.wasm:1
({"Object.<anonymous>":function(module,exports,require,__dirname,__filename,jest){


SyntaxError: Invalid or unexpected token

  at Runtime.createScriptFromCode (node_modules/jest-runtime/build/index.js:1728:14)
*/
test(`should run a test via mf.dispatchFetch with handler defined as a global`, async () => {
  async function handleRequest() {
    return new Response("OK");
  }

  const mf = new Miniflare({
    script: `
      export default {
        fetch: handleRequest,
      }

      // set modules: false for this version
      // addEventListener("fetch", event => {
      //   event.respondWith(handleRequest(event.request))
      // })
    `,
    globals: {
      // https://miniflare.dev/get-started/api/#dispatching-events
      handleRequest,
      Response,
    },
    modules: true,
  });

  let result;
  try {
    result = await mf.dispatchFetch("http://localhost:8787/");
  } catch (error) {
    // Trying to repro this issue, but Jest is failing to compile
    // FetchError [ERR_RESPONSE_TYPE]: Fetch handler didn't respond with a Response object.
    console.error(error);
  }
  expect(result?.status).toBe(200);
  expect(result?.headers.get("content-type")).toContain("text/plain");

  const text = await result?.text();
  expect(text).toContain("OK");
  expect.assertions(5);
});
