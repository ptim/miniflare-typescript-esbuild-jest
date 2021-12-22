import { handleRequest } from "@/index";

/**
  FAIL  test/index.spec.ts
  ● Test suite failed to run

    SyntaxError: The requested module 'itty-router' does not provide an export named 'Router'

      at Runtime.linkAndEvaluateModule (node_modules/jest-runtime/build/index.js:779:5)
 */
test("should redirect to example page on no route match", async () => {
  const env = getMiniflareBindings();
  const res = await handleRequest(new Request("http://localhost"), env);
  expect(res.status).toBe(200);
  expect(await res.text()).toContain("OK");
});
