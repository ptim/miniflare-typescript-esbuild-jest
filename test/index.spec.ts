import { Miniflare } from "miniflare";

test("should redirect", async () => {
  const mf = new Miniflare({
    scriptPath: "dist/index.mjs",
    modules: true,
  });

  const result = await mf.dispatchFetch("http://localhost/");
  expect(result.headers.get("location")).toEqual("http://redirected.dev/");
});
