import { Miniflare } from "miniflare";
import { handleRequest } from "@/index";

test("should redirect", async () => {
  const env = getMiniflareBindings();
  const res = await handleRequest(new Request("http://localhost"), env);
  expect(res.headers.get("location")).toEqual("http://redirected.dev/");
});

test("should redirect (using mf.dispatchFetch)", async () => {
  const mf = new Miniflare({
    scriptPath: "dist/index.mjs",
    modules: true,
  });
  const res = await mf.dispatchFetch("http://localhost/");
  expect(res.headers.get("location")).toEqual("http://redirected.dev/");
});
