# Miniflare Example Project

> And is it possible to generate these tags for example, from an api response? We would like to use dinamic og title and images, and it is not clear how to implement it.

See:

- https://developers.cloudflare.com/workers/runtime-apis/html-rewriter/#element-handlers
- https://developers.cloudflare.com/workers/examples/rewrite-links/

---

This is an example [Cloudflare Workers](https://workers.cloudflare.com/) project that uses [Miniflare](https://github.com/cloudflare/miniflare) for local development, [TypeScript](https://www.typescriptlang.org/), [esbuild](https://github.com/evanw/esbuild) for bundling, and [Jest](https://jestjs.io/) for testing, with [Miniflare's custom Jest environment](https://v2.miniflare.dev/jest.html).

```shell
# Install dependencies
$ npm install
# Start local development server with live reload
$ npm run dev
# Run tests
$ npm test
# Run type checking
$ npm run types:check
```
