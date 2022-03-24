import { handleRequest } from "@/index";

test("should return 200", async () => {
  const env = getMiniflareBindings();
  const res = await handleRequest(new Request("http://localhost"), env);
  expect(res.status).toBe(200);

  const text = await res?.text();
  expect(text).toContain("OK");
});
